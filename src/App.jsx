import { useEffect, useState } from "react";
import AgentforceConversation from "./AgentforceConversation.jsx";
import Storefront from "./Storefront.jsx";

async function loadConfig() {
  const res = await fetch("/config.js");
  const text = await res.text();
  // eslint-disable-next-line no-new-func
  new Function(text)();
  return window.__PRONTO_CONFIG__;
}

export default function App() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    loadConfig().then(setConfig);
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          background: "rgba(0, 0, 0, 0.55)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--panel-border)",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <img src="/pronto-logo.svg" alt="Pronto" style={{ height: 34 }} />
      </header>

      <main style={{ flex: 1 }}>
        {!config && (
          <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
            <p>Loading…</p>
          </div>
        )}

        {config && config.authenticated === false && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "calc(100vh - 64px)",
              textAlign: "center",
            }}
          >
            <div>
              <h1 style={{ color: "var(--primary)" }}>Chat with Casey</h1>
              <p style={{ color: "var(--muted)" }}>
                Pronto Food Delivery's virtual assistant, powered by Agentforce.
              </p>
              <a
                href="/auth/login"
                style={{
                  display: "inline-block",
                  marginTop: 12,
                  padding: "10px 24px",
                  background: "var(--cta)",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  borderRadius: 8,
                  boxShadow: "0 4px 16px rgba(255, 122, 61, 0.35)",
                }}
              >
                Log in with Salesforce
              </a>
            </div>
          </div>
        )}

        {config && config.authenticated && (
          <>
            <Storefront userName="Alex" />
            {/* Floating mode docks Casey bottom-right with her own FAB, same as the
                Multi-Framework reference screenshot's chat panel. */}
            <AgentforceConversation
              frontdoorUrl={config.frontdoorUrl}
              agentId={config.agentId}
              agentLabel={config.agentLabel}
              mode="floating"
            />
          </>
        )}
      </main>
    </div>
  );
}
