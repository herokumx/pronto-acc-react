const RESTAURANTS = [
  { name: "Sushi Kai", cuisine: "Japanese", rating: 4.8, emoji: "🍣" },
  { name: "Bella Italia", cuisine: "Italian", rating: 4.6, emoji: "🍝" },
  { name: "The Burger Shed", cuisine: "American", rating: 4.5, emoji: "🍔" },
  { name: "Spice Garden", cuisine: "Indian", rating: 4.7, emoji: "🍛" },
];

const HELP_TOPICS = [
  { icon: "📦", label: "Missing items" },
  { icon: "⏰", label: "Order late" },
  { icon: "💳", label: "Refund" },
];

function RestaurantCard({ r, showReorder }) {
  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: 12,
        padding: 16,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minWidth: 180,
      }}
    >
      <div
        style={{
          background: "#fdeee9",
          borderRadius: 8,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
        }}
      >
        {r.emoji}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontWeight: 700 }}>{r.name}</div>
          <div style={{ color: "var(--pronto-link)", fontSize: 13 }}>{r.cuisine}</div>
          <div style={{ fontSize: 13 }}>⭐ {r.rating}</div>
        </div>
        {showReorder && (
          <button
            style={{
              border: "1px solid #e2734a",
              color: "#e2734a",
              background: "transparent",
              borderRadius: 16,
              padding: "4px 12px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Reorder
          </button>
        )}
      </div>
    </div>
  );
}

export default function Storefront({ userName = "there" }) {
  return (
    <div style={{ background: "#fdf3f0", minHeight: "calc(100vh - 64px)", padding: "24px 32px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <span>Hi, {userName} 👋</span>
        <span
          style={{
            background: "#f5dfa0",
            borderRadius: 16,
            padding: "4px 12px",
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          Gold ⭐
        </span>
      </div>

      <div
        style={{
          background: "#fff",
          borderLeft: "4px solid #e2734a",
          borderRadius: 12,
          padding: 20,
          marginBottom: 32,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <strong>Your Pronto Rewards</strong>
          <a href="#" style={{ color: "#e2734a", fontSize: 13, textDecoration: "none" }}>
            View history
          </a>
        </div>
        <div style={{ margin: "10px 0", display: "flex", gap: 10, alignItems: "center" }}>
          <span
            style={{
              background: "#f5dfa0",
              borderRadius: 16,
              padding: "2px 10px",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            Gold ⭐
          </span>
          <span style={{ fontWeight: 700 }}>340 pts balance</span>
        </div>
        <div style={{ background: "#fbe0d6", borderRadius: 8, height: 8, overflow: "hidden" }}>
          <div style={{ background: "#e2734a", width: "68%", height: "100%" }} />
        </div>
        <div style={{ fontSize: 13, marginTop: 6, color: "#666" }}>160 points to Platinum.</div>
      </div>

      <h3>Deals picked for you</h3>
      <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
        {RESTAURANTS.map((r) => (
          <RestaurantCard key={r.name} r={r} />
        ))}
      </div>

      <h3>Your favourites</h3>
      <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
        {RESTAURANTS.slice(0, 3).map((r) => (
          <RestaurantCard key={r.name} r={r} showReorder />
        ))}
      </div>

      <h3>What do you need help with?</h3>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {HELP_TOPICS.map((t) => (
          <div
            key={t.label}
            style={{
              border: "1px solid #eee",
              borderRadius: 12,
              padding: "16px 24px",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 12,
              minWidth: 180,
            }}
          >
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            <span style={{ fontWeight: 600 }}>{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
