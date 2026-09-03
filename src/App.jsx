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
          background: "var(--pronto-header-bg)",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <img src="/pronto-logo.png" alt="Pronto" style={{ height: 32 }} />
        <span style={{ color: "#fff", fontFamily: "Montserrat", fontWeight: 700, fontSize: 20 }}>
          Pronto Help
        </span>
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
              background: "#fdf3f0",
              textAlign: "center",
            }}
          >
            <div>
              <h1>Chat with Casey</h1>
              <p>Pronto Food Delivery's virtual assistant, powered by Agentforce.</p>
              <a
                href="/auth/login"
                style={{
                  display: "inline-block",
                  marginTop: 12,
                  padding: "10px 24px",
                  background: "var(--pronto-action)",
                  color: "#fff",
                  borderRadius: 24,
                  textDecoration: "none",
                  fontWeight: 700,
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
