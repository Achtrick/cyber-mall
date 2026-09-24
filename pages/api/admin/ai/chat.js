import Anthropic from "@anthropic-ai/sdk";
import nc from "next-connect";
import auth from "../../../../middlewares/admin-auth";
import AiChatMessage from "../../../../models/aiChatMessage.model";
import Shop from "../../../../models/shop.model";
import connectDB from "../../../../utils/connectDB";
import { AI_TOOLS, AI_TOOL_EXECUTORS } from "../../../../utils/shared/aiTools";
import { fail, rateLimit, str } from "../../../../utils/shared/security";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5";
const MAX_TOOL_ITERATIONS = 6;
const HISTORY_LIMIT = 30; // messages kept for display and sent as prior context
const MAX_MESSAGE_LENGTH = 2000;
const PREMIUM_REQUIRED_MESSAGE =
  "The AI assistant is a PREMIUM feature. Upgrade your plan to use it.";

/** Loads the caller's own shop and enforces the PREMIUM gate; writes the
 * response and returns null if blocked, otherwise returns the shop doc. */
const requirePremiumShop = async (req, res, select) => {
  const shop = await Shop.findById(req.auth.shopId)
    .select(`pack ${select ?? ""}`)
    .lean();
  if (!shop) {
    res.status(404).json({ message: "Shop not found" });
    return null;
  }
  if (shop.pack?.type !== "PREMIUM") {
    res.status(403).json({ message: PREMIUM_REQUIRED_MESSAGE, premiumRequired: true });
    return null;
  }
  return shop;
};

let client = null;
const getClient = () => {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client)
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
};

const systemPrompt = (shopName) =>
  `You are the inventory and sales assistant for the admin of the Cyber-Mall shop "${shopName}". ` +
  `You can look up stock levels, find products, adjust stock quantities, and summarize recent orders -- always through the tools, never by guessing or inventing numbers. ` +
  `When asked to change a quantity (e.g. "add 20 to product x", "set y to 5"), resolve the product (search if the name is ambiguous), call adjust_product_quantity, then clearly confirm what changed (old -> new quantity). ` +
  `If a product name matches more than one product, ask the admin to clarify instead of guessing which one. ` +
  `Keep replies short and concrete -- numbers and product names, not filler. Formatting is plain text (no markdown tables).`;

/** One line summarizing a mutating tool call, for the persisted audit trail. */
const summarizeAction = (name, result) => {
  if (name === "adjust_product_quantity" && !result?.error) {
    return `${result.designation}: ${result.previousQty} -> ${result.newQty}`;
  }
  return null;
};

const handler = nc({
  onError: (err, req, res) =>
    fail(res, err, 500, "AI assistant request failed"),
});

handler.use(auth);

handler.get(async (req, res) => {
  await connectDB();
  if (!(await requirePremiumShop(req, res))) return;
  const history = await AiChatMessage.find({ shop: req.auth.shopId })
    .sort({ createdAt: -1 })
    .limit(HISTORY_LIMIT)
    .lean();
  res.status(200).json(
    history.reverse().map((m) => ({
      role: m.role,
      content: m.content,
      actions: m.actions ?? [],
      createdAt: m.createdAt,
    })),
  );
});

handler.post(async (req, res) => {
  if (
    !rateLimit(req, res, {
      name: "ai-chat",
      key: req.auth.userId,
      max: 30,
      windowMs: 60 * 60 * 1000,
    })
  )
    return;

  const anthropic = getClient();
  if (!anthropic) {
    return res.status(503).json({
      message:
        "The AI assistant isn't configured yet. Set ANTHROPIC_API_KEY to enable it.",
    });
  }

  const userMessage = str(req.body?.message, MAX_MESSAGE_LENGTH);
  if (!userMessage)
    return res.status(400).json({ message: "Message is required" });

  await connectDB();
  const shopId = req.auth.shopId;
  const shop = await requirePremiumShop(req, res, "name");
  if (!shop) return;

  const priorHistory = await AiChatMessage.find({ shop: shopId })
    .sort({ createdAt: -1 })
    .limit(HISTORY_LIMIT)
    .lean();

  const messages = priorHistory
    .reverse()
    .map((m) => ({ role: m.role, content: m.content }));
  messages.push({ role: "user", content: userMessage });

  const actions = [];
  let finalText = "";

  try {
    for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
      const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 1536,
        system: systemPrompt(shop.name),
        thinking: { type: "adaptive" },
        output_config: { effort: "medium" },
        tools: AI_TOOLS,
        messages,
      });

      if (response.stop_reason === "refusal") {
        finalText = "I can't help with that request.";
        break;
      }

      const toolUses = response.content.filter((b) => b.type === "tool_use");
      const text = response.content
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();
      if (text) finalText = text;

      if (response.stop_reason !== "tool_use" || toolUses.length === 0) break;

      messages.push({ role: "assistant", content: response.content });

      const toolResults = [];
      for (const toolUse of toolUses) {
        const executor = AI_TOOL_EXECUTORS[toolUse.name];
        let result;
        if (!executor) {
          result = { error: `Unknown tool: ${toolUse.name}` };
        } else {
          try {
            result = await executor(toolUse.input, { shopId });
          } catch (err) {
            console.error(`AI tool ${toolUse.name} failed`, err);
            result = { error: "That action failed on the server." };
          }
        }
        const summary = summarizeAction(toolUse.name, result);
        if (summary) actions.push({ tool: toolUse.name, summary });
        toolResults.push({
          type: "tool_result",
          tool_use_id: toolUse.id,
          content: JSON.stringify(result),
          is_error: Boolean(result?.error),
        });
      }
      messages.push({ role: "user", content: toolResults });
    }
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return res
        .status(503)
        .json({ message: "The AI assistant's API key is invalid." });
    }
    if (err instanceof Anthropic.RateLimitError) {
      return res
        .status(429)
        .json({ message: "The AI assistant is busy, try again shortly." });
    }
    console.error("AI chat failed", err);
    return res
      .status(500)
      .json({ message: "The AI assistant couldn't complete that request." });
  }

  if (!finalText) finalText = "Done.";

  await AiChatMessage.create([
    { shop: shopId, user: req.auth.userId, role: "user", content: userMessage },
    {
      shop: shopId,
      user: req.auth.userId,
      role: "assistant",
      content: finalText,
      actions,
    },
  ]);

  res.status(200).json({ reply: finalText, actions });
});

export default handler;
