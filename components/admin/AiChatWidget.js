import axios from "axios";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/admin/AiChatWidget.module.scss";
import { checkExpirity } from "../../utils/shared/checkExpirity";
import { getError } from "../../utils/shared/getError";
import {
  AutoAwesomeIcon,
  CloseIcon,
  FullscreenExitIcon,
  FullscreenIcon,
  RemoveIcon,
  SendIcon,
} from "../../utils/theme/icons";

const SUGGESTIONS = [
  "Show me the stock report",
  "What's low on stock?",
  "Show pending orders",
  "Give me a shop overview",
];

// Viewport-relative so the same values work on any screen size with no
// separate mobile breakpoint needed (see AiChatWidget.module.scss).
const PANEL_SIZE = {
  width: "min(380px, calc(100vw - 36px))",
  height: "min(560px, calc(100vh - 108px))",
};
const PANEL_SIZE_MAXIMIZED = {
  width: "min(760px, calc(100vw - 36px))",
  height: "min(80vh, 780px)",
};

// Floating chat widget: a FAB (bottom-right) that expands into a chat panel
// with its own minimize/maximize/close window chrome. Positioned to clear
// components/installPwa.js's small install button (also fixed bottom-right,
// 10px/10px, 30x30) -- see the bottom offset in AiChatWidget.module.scss.
function AiChatWidget() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // userInfo comes from localStorage, which the server can never see, so its
  // very first client render must match the server's (nothing) -- only show
  // the widget after mounting, once hydration has settled.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [open, setOpen] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  // null | "unconfigured" (no ANTHROPIC_API_KEY) | "premiumRequired"
  const [blocked, setBlocked] = useState(null);

  const isPremium = userInfo?.shop?.pack?.type === "PREMIUM";

  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending, open]);

  const getHistory = async () => {
    setLoadingHistory(true);
    try {
      const { data } = await axios.get("/api/admin/ai/chat");
      setMessages(data);
      setHistoryLoaded(true);
      setLoadingHistory(false);
    } catch (error) {
      checkExpirity(error, dispatch);
      if (error?.response?.data?.premiumRequired) {
        setBlocked("premiumRequired");
      } else {
        enqueueSnackbar(getError(error), { variant: "error" });
      }
      setLoadingHistory(false);
    }
  };

  const openWidget = () => {
    setOpen(true);
    if (!isPremium) {
      setBlocked("premiumRequired");
      return;
    }
    if (!historyLoaded) getHistory();
  };

  const minimize = () => {
    setOpen(false);
    setMaximized(false);
  };

  const send = async (text) => {
    const message = (text ?? input).trim();
    if (!message || sending) return;

    setMessages((prev) => [...prev, { role: "user", content: message, actions: [] }]);
    setInput("");
    setSending(true);
    try {
      const { data } = await axios.post("/api/admin/ai/chat", { message });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply, actions: data.actions ?? [] },
      ]);
    } catch (error) {
      checkExpirity(error, dispatch);
      if (error?.response?.data?.premiumRequired) {
        setBlocked("premiumRequired");
      } else if (error?.response?.status === 503) {
        setBlocked("unconfigured");
      } else {
        enqueueSnackbar(getError(error), { variant: "error" });
        setMessages((prev) => prev.slice(0, -1));
      }
    } finally {
      setSending(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    send();
  };

  if (!mounted || !userInfo) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Open AI assistant"
        className={styles.fab}
        style={{
          opacity: open ? 0 : 1,
          pointerEvents: open ? "none" : "auto",
          transform: open ? "scale(0.4)" : "scale(1)",
        }}
        onClick={openWidget}
      >
        <AutoAwesomeIcon />
        {!isPremium ? <span className={styles.proBadge}>PRO</span> : null}
      </button>

      <div
        className={styles.panel}
        style={{
          ...(maximized ? PANEL_SIZE_MAXIMIZED : PANEL_SIZE),
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transform: open ? "scale(1) translateY(0)" : "scale(0.85) translateY(16px)",
        }}
        role="dialog"
        aria-label="AI assistant"
        aria-hidden={!open}
      >
        <div className={styles.titlebar}>
          <div className={styles.titlebarLabel}>
            <AutoAwesomeIcon sx={{ fontSize: 18 }} />
            <span>AI assistant</span>
          </div>
          <div className={styles.titlebarControls}>
            <button type="button" aria-label="Minimize" onClick={minimize}>
              <RemoveIcon sx={{ fontSize: 16 }} />
            </button>
            <button
              type="button"
              aria-label={maximized ? "Restore" : "Maximize"}
              onClick={() => setMaximized((m) => !m)}
            >
              {maximized ? (
                <FullscreenExitIcon sx={{ fontSize: 16 }} />
              ) : (
                <FullscreenIcon sx={{ fontSize: 16 }} />
              )}
            </button>
            <button type="button" aria-label="Close" onClick={minimize}>
              <CloseIcon sx={{ fontSize: 16 }} />
            </button>
          </div>
        </div>

        {blocked === "premiumRequired" ? (
          <div className={styles.upsell}>
            <AutoAwesomeIcon className={styles.upsellIcon} />
            <h3>AI assistant is a PREMIUM feature</h3>
            <p>
              Get stock reports, low-stock alerts, and quantity updates just
              by asking -- upgrade to unlock it.
            </p>
            <Link href="/admin/account" className="btn btn-primary">
              View premium plans
            </Link>
          </div>
        ) : blocked === "unconfigured" ? (
          <div className={styles.notice}>
            The AI assistant isn&apos;t configured yet. An administrator needs
            to set an Anthropic API key on the server.
          </div>
        ) : (
          <>
            <div className={styles.thread} ref={scrollRef}>
              {loadingHistory ? (
                <div className={styles.emptyState}>Loading...</div>
              ) : messages.length === 0 ? (
                <div className={styles.emptyState}>
                  <AutoAwesomeIcon className={styles.emptyIcon} />
                  <p>Ask me anything about your shop.</p>
                  <div className={styles.suggestions}>
                    {SUGGESTIONS.map((s) => (
                      <button
                        type="button"
                        key={s}
                        className={styles.suggestion}
                        onClick={() => send(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div
                    key={i}
                    className={`${styles.bubbleRow} ${
                      m.role === "user" ? styles.fromUser : styles.fromAssistant
                    }`}
                  >
                    <div className={styles.bubble}>
                      {m.content}
                      {m.actions?.length ? (
                        <div className={styles.actions}>
                          {m.actions.map((a, j) => (
                            <span className={styles.actionPill} key={j}>
                              ✓ {a.summary}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
              {sending ? (
                <div className={`${styles.bubbleRow} ${styles.fromAssistant}`}>
                  <div className={`${styles.bubble} ${styles.typing}`}>
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              ) : null}
            </div>

            {messages.length > 0 && !loadingHistory ? (
              <div className={styles.quickSuggestions}>
                {SUGGESTIONS.map((s) => (
                  <button
                    type="button"
                    key={s}
                    className={styles.chip}
                    onClick={() => send(s)}
                    disabled={sending}
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : null}

            <form className={styles.inputRow} onSubmit={onSubmit}>
              <input
                className="defaultInput"
                placeholder="Ask about stock, orders, or say 'add 20 to product x'"
                value={input}
                disabled={sending}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={sending || !input.trim()}
              >
                <SendIcon sx={{ fontSize: 18 }} />
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
}

export default AiChatWidget;
