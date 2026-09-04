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
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            padding: "4px 8px",
            borderRadius: 6,
            background: "var(--secondary)",
            color: "var(--silver)",
          }}
        >
          Customer View
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
              minHeight: "calc(100vh - 67px)",
              padding: 24,
            }}
          >
            <div
              className="glass-panel"
              style={{
                width: "100%",
                maxWidth: 380,
                padding: "36px 32px",
                textAlign: "center",
              }}
            >
              <img
                src="/pronto-icon.png"
                alt=""
                style={{ width: 64, height: 64, margin: "0 auto 18px", display: "block" }}
              />
              <h1 style={{ color: "var(--primary)", fontSize: 22, marginBottom: 6 }}>
                Pronto Ordering
              </h1>
              <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24 }}>
                Order food, track deliveries, and get help from Casey — your Pronto virtual
                assistant.
              </p>
              <a
                href="/auth/login"
                style={{
                  display: "block",
                  padding: "12px 24px",
                  background: "var(--cta)",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 800,
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  borderRadius: 8,
                  boxShadow: "0 4px 16px rgba(255, 122, 61, 0.35)",
                }}
              >
                Log in with Salesforce
              </a>
              <p style={{ color: "var(--muted)", fontSize: 11, marginTop: 18, opacity: 0.7 }}>
                Powered by Agentforce
              </p>
            </div>
          </div>
        )}

        {config && config.authenticated && (
          <>
            <Storefront userName="Alex" />
            {/* mode="floating" builds our own branded trigger button + panel and only ever asks
                ACC for its "inline" rendering inside that panel — see AgentforceConversation.jsx
                for why we don't use ACC's own floating widget. */}
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
