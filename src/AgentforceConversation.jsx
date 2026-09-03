import { useEffect, useRef, useState } from "react";
import { embedAgentforceClient } from "@salesforce/agentforce-conversation-client";

// Embeds Casey via the real Agentforce Conversation Client (ACC) SDK.
// frontdoorUrl comes from a live, server-side OAuth session — see server.js /config.js.
export default function AgentforceConversation({
  frontdoorUrl,
  agentId,
  agentLabel,
  mode = "inline",
}) {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    // ACC renders inside a cross-origin Salesforce iframe, so image URLs must be absolute and
    // publicly reachable — a relative path won't resolve from inside that iframe. Deriving from
    // window.location.origin (rather than hardcoding our own Heroku URL) means this works
    // automatically for any learner's own deployed app too.
    const origin = window.location.origin;
    const iconUrl = `${origin}/pronto-icon.svg`;

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
            floatingButtonImage: mode === "floating" ? iconUrl : undefined,
            floatingButtonImageAlt: mode === "floating" ? "Chat with Casey" : undefined,
            renderingConfig:
              mode === "floating"
                ? { mode: "floating", styleTokens: brandingTokens, ...brandingImages }
                : {
                    mode: "inline",
                    width: "100%",
                    height: "600px",
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
  }, [frontdoorUrl, agentId, agentLabel, mode]);

  if (error) {
    return (
      <div style={{ padding: 16, color: "#b00020" }}>
        Casey couldn't load: {error}
        <br />
        Check that your app's domain is added under Setup → Session Settings → Trusted Domains
        for Inline Frames (iFrame Type: LightningOut).
      </div>
    );
  }

  // Floating mode injects its own fixed-position widget + FAB — the anchor div itself
  // shouldn't reserve page space. Inline mode needs real dimensions to render into.
  return (
    <div
      ref={containerRef}
      style={mode === "floating" ? undefined : { width: "100%", minHeight: 600 }}
    />
  );
}
