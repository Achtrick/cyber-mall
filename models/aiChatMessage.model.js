import { Schema, model, models } from "mongoose";

// One row per chat turn (admin AI assistant). Kept as plain display text +
// a compact record of any actions taken -- NOT the raw Anthropic content
// blocks (thinking/tool_use), which only matter while resolving a single
// in-flight turn, not across page reloads. See utils/shared/aiTools.js.
const AiChatMessageSchema = new Schema(
  {
    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    // e.g. [{ tool: "adjust_product_quantity", summary: "Set 'Blue Mug' qty 12 -> 32" }]
    actions: [
      {
        tool: String,
        summary: String,
      },
    ],
  },
  { timestamps: true }
);

AiChatMessageSchema.index({ shop: 1, createdAt: 1 });

const AiChatMessage =
  models.AiChatMessage || model("AiChatMessage", AiChatMessageSchema);

export default AiChatMessage;
