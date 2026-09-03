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

    embedAgentforceClient({
      container,
      frontdoorUrl,
      agentforceClientConfig: {
        agentId,
        agentLabel,
        renderingConfig:
          mode === "floating"
            ? {
                mode: "floating",
                styleTokens: {
                  headerBlockBackground: "#e2635a",
                  headerBlockTextColor: "#ffffff",
                },
              }
            : {
                mode: "inline",
                width: "100%",
                height: "600px",
                styleTokens: {
                  headerBlockBackground: "#e2635a",
                  headerBlockTextColor: "#ffffff",
                },
              },
      },
    }).catch((err) => {
      if (!cancelled) setError(err?.message || String(err));
    });

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
