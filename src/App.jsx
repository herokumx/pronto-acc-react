import { useEffect, useState } from "react";
import AgentforceConversation from "./AgentforceConversation.jsx";

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

      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        {!config && <p>Loading…</p>}

        {config && config.authenticated === false && (
          <div style={{ textAlign: "center" }}>
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
        )}

        {config && config.authenticated && (
          <div style={{ width: "100%", maxWidth: 480 }}>
            <AgentforceConversation
              frontdoorUrl={config.frontdoorUrl}
              agentId={config.agentId}
              agentLabel={config.agentLabel}
            />
          </div>
        )}
      </main>
    </div>
  );
}
