import { useEffect, useRef, useState } from "react";
import { embedAgentforceClient } from "@salesforce/agentforce-conversation-client";

// Embeds Casey via the real Agentforce Conversation Client (ACC) SDK.
// frontdoorUrl comes from a live, server-side OAuth session — see server.js /config.js.
//
// mode="floating" does NOT use ACC's own floating widget. That widget renders its FAB inside a
// sealed custom element (runtime_copilot-acc-sdk-wrapper) with no accessible shadow root and no
// documented API to restyle it — floatingButtonLabel/floatingButtonImage reach the SDK but are
// silently ignored, and there is no way to reach in from outside JS to override them either.
// Instead we build our own trigger button + panel (fully ours, fully brandable) and only ever
// ask ACC for its "inline" rendering mode inside that panel — that mode DOES honor styleTokens
// and the header/avatar image config.
export default function AgentforceConversation({
  frontdoorUrl,
  agentId,
  agentLabel,
  mode = "inline",
}) {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  // Inline placements mount immediately; the floating panel lazy-mounts on first click so the
  // SDK never loads at all for a visitor who doesn't open the chat.
  const [mounted, setMounted] = useState(mode !== "floating");

  useEffect(() => {
    if (!mounted) return;
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    // ACC renders inside a cross-origin Salesforce iframe, so image URLs must be absolute and
    // publicly reachable — a relative path won't resolve from inside that iframe. Deriving from
    // window.location.origin (rather than hardcoding our own Heroku URL) means this works
    // automatically for any learner's own deployed app too.
    const origin = window.location.origin;
    const iconUrl = `${origin}/pronto-icon.png`;

    const brandingTokens = {
      headerBlockBackground: "#ff7a3d",
      headerBlockTextColor: "#ffffff",
    };
    const brandingImages = {
      showHeaderIcon: true,
      headerImageUrl: iconUrl,
      headerImageAlt: "Pronto",
      showAvatar: true,
      agentAvatarUrl: iconUrl,
      agentAvatarAltText: "Casey, Pronto's virtual assistant",
    };

    // embedAgentforceClient doesn't reliably return a real Promise in every code path (observed:
    // a bare "Qe(...).catch is not a function" crash with no error boundary blanks the whole
    // React tree). Wrapping in an async IIFE + try/catch handles that regardless of what it
    // actually returns, instead of chaining .catch directly on its result.
    (async () => {
      try {
        await embedAgentforceClient({
          container,
          frontdoorUrl,
          agentforceClientConfig: {
            agentId,
            agentLabel,
            renderingConfig: {
              mode: "inline",
              width: "100%",
              height: "100%",
              styleTokens: brandingTokens,
              ...brandingImages,
            },
          },
        });
      } catch (err) {
        if (!cancelled) setError(err?.message || String(err));
      }
    })();

    return () => {
      cancelled = true;
      container.replaceChildren();
    };
  }, [mounted, frontdoorUrl, agentId, agentLabel]);

  const conversation = error ? (
    <div style={{ padding: 16, color: "#b00020" }}>
      Casey couldn't load: {error}
      <br />
      Check that your app's domain is added under Setup → Session Settings → Trusted Domains
      for Inline Frames (iFrame Type: LightningOut).
    </div>
  ) : (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
  );

  if (mode !== "floating") {
    return <div style={{ width: "100%", minHeight: 600 }}>{conversation}</div>;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setMounted(true);
          setOpen((wasOpen) => !wasOpen);
        }}
        aria-label={open ? "Close chat with Casey" : "Need help? Chat with Casey"}
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 22px",
          borderRadius: 12,
          border: "none",
          background: "var(--cta)",
          color: "#fff",
          fontWeight: 800,
          fontSize: 15,
          letterSpacing: 0.2,
          cursor: "pointer",
          boxShadow: "0 8px 28px rgba(255, 122, 61, 0.45)",
        }}
      >
        <img
          src="/pronto-icon.png"
          alt=""
          style={{ width: 22, height: 22, borderRadius: 6, display: "block" }}
        />
        {open ? "Close" : "Need Help?"}
      </button>

      {mounted && (
        <div
          style={{
            position: "fixed",
            right: 24,
            bottom: 92,
            zIndex: 9998,
            width: 380,
            maxWidth: "calc(100vw - 48px)",
            height: 600,
            maxHeight: "calc(100vh - 140px)",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
            border: "1px solid var(--panel-border)",
            background: "var(--card)",
            // Hidden via visibility/opacity, never unmounted, so the ACC session survives
            // toggling closed and reopening doesn't reconnect from scratch.
            visibility: open ? "visible" : "hidden",
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.15s ease, transform 0.15s ease",
            pointerEvents: open ? "auto" : "none",
          }}
        >
          {conversation}
        </div>
      )}
    </>
  );
}
