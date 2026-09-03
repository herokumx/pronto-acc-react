// Pronto Food Delivery — Heroku server for the ACC React app.
//
// Handles the real "Login with Salesforce" OAuth 2.0 Web Server Flow: a visitor clicks Login,
// authenticates against their own org, and the resulting session is exchanged for a Lightning
// Out frontdoor URL that the browser uses to embed Casey via ACC. No baked-in tokens.
import "dotenv/config";
import express from "express";
import session from "express-session";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

const {
  SF_LOGIN_URL, // e.g. https://orgfarm-292ccceca3.my.salesforce.com
  SF_CLIENT_ID, // Consumer Key of your External Client App / Connected App
  SF_CLIENT_SECRET, // Consumer Secret
  CASEY_AGENT_ID, // Casey's Bot Id in your org, e.g. 0Xxxxxxxxxxxxxxxxx
  SESSION_SECRET = "pronto-dev-secret-change-me",
  APP_URL, // e.g. https://your-app-xxxxxxxxxxxx.herokuapp.com (set after first deploy)
} = process.env;

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax" },
  })
);

function baseUrl(req) {
  return APP_URL || `${req.protocol}://${req.get("host")}`;
}

// PKCE (RFC 7636) — required because our ECA's Security settings have "Require Proof Key for
// Code Exchange" checked. Without this, /authorize rejects with "missing required code challenge".
function base64url(buffer) {
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Step 1: kick off the OAuth Web Server Flow.
app.get("/auth/login", (req, res) => {
  const codeVerifier = base64url(crypto.randomBytes(32));
  const codeChallenge = base64url(crypto.createHash("sha256").update(codeVerifier).digest());
  req.session.codeVerifier = codeVerifier;

  const redirectUri = `${baseUrl(req)}/auth/callback`;
  const authorizeUrl = new URL(`${SF_LOGIN_URL}/services/oauth2/authorize`);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", SF_CLIENT_ID);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", "api id web refresh_token");
  authorizeUrl.searchParams.set("code_challenge", codeChallenge);
  authorizeUrl.searchParams.set("code_challenge_method", "S256");

  // req.session.codeVerifier must be persisted before the redirect fires.
  req.session.save(() => res.redirect(authorizeUrl.toString()));
});

// Step 2: exchange the authorization code for an access token + instance URL.
app.get("/auth/callback", async (req, res) => {
  const { code, error, error_description } = req.query;
  if (error) return res.status(400).send(`OAuth error: ${error} — ${error_description || ""}`);

  const redirectUri = `${baseUrl(req)}/auth/callback`;
  const tokenRes = await fetch(`${SF_LOGIN_URL}/services/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: SF_CLIENT_ID,
      client_secret: SF_CLIENT_SECRET,
      redirect_uri: redirectUri,
      code_verifier: req.session.codeVerifier || "",
    }),
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    return res.status(502).send(`Token exchange failed: ${text}`);
  }

  const token = await tokenRes.json();
  req.session.accessToken = token.access_token;
  req.session.instanceUrl = token.instance_url;
  res.redirect("/");
});

app.get("/auth/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

// Client reads this to know if it should show the login screen or the chat.
app.get("/auth/status", (req, res) => {
  res.json({ authenticated: Boolean(req.session.accessToken) });
});

// Authenticated config: builds the Lightning Out frontdoor URL from the live session.
// Never exposes the raw access token to the browser.
app.get("/config.js", (req, res) => {
  res.type("application/javascript");
  if (!req.session.accessToken) {
    res.send(`window.__PRONTO_CONFIG__ = { authenticated: false };`);
    return;
  }
  const frontdoorUrl = `${req.session.instanceUrl}/secur/frontdoor.jsp?sid=${req.session.accessToken}`;
  res.send(
    `window.__PRONTO_CONFIG__ = ${JSON.stringify({
      authenticated: true,
      frontdoorUrl,
      agentId: CASEY_AGENT_ID,
      agentLabel: "Casey",
    })};`
  );
});

app.use(express.static(path.join(__dirname, "dist")));
app.use((req, res) => res.sendFile(path.join(__dirname, "dist", "index.html")));

app.listen(PORT, () => console.log(`Pronto ACC app listening on :${PORT}`));
