import { PRODUCTS, HELP_TOPICS } from "./catalog.js";

const badgeLabel = { b2c: "Individual", b2b: "Business", both: "Both" };

function ProductCard({ p }) {
  return (
    <div className="glass-panel" style={{ overflow: "hidden" }}>
      <img
        src={p.image}
        alt={p.name}
        style={{ width: "100%", height: 150, objectFit: "cover", display: "block" }}
      />
      <div style={{ padding: "12px 14px 14px" }}>
        <div
          style={{
            color: "var(--primary)",
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.6,
          }}
        >
          {p.restaurant}
        </div>
        <div style={{ fontWeight: 700, fontSize: 15, margin: "4px 0 2px" }}>{p.name}</div>
        {p.minNote && <div style={{ fontSize: 12, color: "var(--muted)" }}>{p.minNote}</div>}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <span style={{ fontWeight: 800, fontSize: 15 }}>{p.priceLabel}</span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "3px 8px",
              textTransform: "uppercase",
              border: "1px solid",
              borderColor:
                p.channel === "b2c" ? "var(--primary)" : p.channel === "b2b" ? "var(--accent)" : "var(--muted)",
              color:
                p.channel === "b2c" ? "var(--primary)" : p.channel === "b2b" ? "var(--accent)" : "var(--muted)",
            }}
          >
            {badgeLabel[p.channel]}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Storefront({ userName = "there" }) {
  const individual = PRODUCTS.filter((p) => p.channel === "b2c" || p.channel === "both");
  const bulk = PRODUCTS.filter((p) => p.channel === "b2b" || p.channel === "both");

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", padding: "24px 32px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <span style={{ color: "var(--muted)" }}>Hi, {userName}</span>
        <span
          style={{
            background: "var(--primary)",
            color: "#1a1a1a",
            borderRadius: 8,
            padding: "4px 12px",
            fontWeight: 700,
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Gold Tier
        </span>
      </div>

      <div
        className="glass-panel"
        style={{
          borderLeft: "4px solid var(--accent)",
          padding: 20,
          marginBottom: 32,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span
              style={{
                background: "var(--primary)",
                color: "#1a1a1a",
                borderRadius: 8,
                padding: "2px 10px",
                fontWeight: 700,
                fontSize: 12,
                textTransform: "uppercase",
              }}
            >
              Gold Tier
            </span>
            <strong>340 pts balance</strong>
          </div>
          <div style={{ background: "#2a2222", height: 6, width: 220, marginTop: 8 }}>
            <div style={{ background: "var(--accent)", width: "68%", height: "100%" }} />
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>
            160 points to Platinum.
          </div>
        </div>
        <a
          href="#"
          style={{
            color: "var(--accent)",
            fontSize: 13,
            textDecoration: "none",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          View History →
        </a>
      </div>

      <div
        className="glass-panel"
        style={{
          padding: "16px 20px",
          marginBottom: 32,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <strong>Ordering for a team or event?</strong>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
            Switch to a Pronto for Business account for group ordering, centralized billing, and
            spend limits.
          </div>
        </div>
        <a
          href="#"
          style={{
            color: "#1a1a1a",
            background: "var(--primary)",
            fontSize: 13,
            textDecoration: "none",
            fontWeight: 700,
            padding: "8px 16px",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            whiteSpace: "nowrap",
            borderRadius: 8,
          }}
        >
          Switch to Business Account
        </a>
      </div>

      <h2
        style={{
          fontSize: 18,
          textTransform: "uppercase",
          letterSpacing: 1,
          color: "var(--primary)",
          borderLeft: "3px solid var(--accent)",
          paddingLeft: 10,
          marginBottom: 14,
        }}
      >
        Individual Favorites
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 18,
          marginBottom: 34,
        }}
      >
        {individual.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>

      <h2
        style={{
          fontSize: 18,
          textTransform: "uppercase",
          letterSpacing: 1,
          color: "var(--primary)",
          borderLeft: "3px solid var(--accent)",
          paddingLeft: 10,
          marginBottom: 14,
        }}
      >
        Feeding a Group? Order for the Office.
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 18,
          marginBottom: 34,
        }}
      >
        {bulk.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>

      <h2
        style={{
          fontSize: 18,
          textTransform: "uppercase",
          letterSpacing: 1,
          color: "var(--primary)",
          borderLeft: "3px solid var(--accent)",
          paddingLeft: 10,
          marginBottom: 14,
        }}
      >
        What Do You Need Help With?
      </h2>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        {HELP_TOPICS.map((t) => (
          <div
            key={t.label}
            className="glass-panel"
            style={{
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontWeight: 600,
              minWidth: 170,
            }}
          >
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            <span>{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
