# Pronto ACC React

A React app, hosted on Heroku, that embeds **Casey** (the Pronto Food Delivery Help Agent) using
the real **Agentforce Conversation Client (ACC)** SDK — no hand-rolled MIAW client, no
workarounds. Built for the Dreamforce Day0 Technical Workshop, Unit 4.

Visiting the site shows a **"Log in with Salesforce"** button. Logging in performs a real OAuth
2.0 Web Server Flow against your own org, then embeds Casey inline via
`@salesforce/agentforce-conversation-client`. This is the **authenticated/employee integration
pattern** — see the callout in the workshop guide about why this differs from a public,
anonymous customer-facing chat widget (that's what Section 2, Enhanced Chat v2 + CLT, is for).

## Prerequisites in your own org

1. **Casey exists** (Unit 0 of the workshop) and you know her Bot Id.
2. **An External Client App (or Connected App)** with:
   - OAuth enabled, Web Server Flow
   - Scopes: `api`, `id`, `web`, `refresh_token`
   - A callback URL matching wherever this app runs: `http://localhost:5173/auth/callback` for
     local dev, `https://<your-app>.herokuapp.com/auth/callback` once deployed
   - Its Consumer Key / Secret
3. **Setup → Session Settings → Trusted Domains for Inline Frames** — add your app's domain
   (`http://localhost:5173` for local dev, your Heroku URL once deployed), iFrame Type:
   **LightningOut**.
4. **Setup → My Domain → "Require first-party use of Salesforce cookies"** — unchecked.

## Local dev

```bash
npm install
cp .env.example .env   # fill in SF_LOGIN_URL, SF_CLIENT_ID, SF_CLIENT_SECRET, CASEY_AGENT_ID
npm run build
npm start               # serves on :3000
# in another terminal, for hot-reload dev instead: npm run dev (serves on :5173, proxies /auth + /config.js to :3000)
```

## Deploy to Heroku

```bash
heroku create
heroku config:set SF_LOGIN_URL=... SF_CLIENT_ID=... SF_CLIENT_SECRET=... CASEY_AGENT_ID=... APP_URL=https://<your-app>.herokuapp.com
git push heroku main
```

Then go back and:
- Add `https://<your-app>.herokuapp.com/auth/callback` to your ECA's callback URLs
- Add `https://<your-app>.herokuapp.com` to Trusted Domains for Inline Frames

## How it works

- `server.js` — Express server. Handles `/auth/login` (redirect to Salesforce), `/auth/callback`
  (exchanges the auth code for an access token + instance URL, stores it server-side in a
  session), and `/config.js` (returns a Lightning Out `frontdoorUrl` built from the live session
  — the browser never sees the raw access token).
- `src/AgentforceConversation.jsx` — the actual ACC embed, using
  `embedAgentforceClient()` per Salesforce's own React integration pattern.
- `src/App.jsx` — login screen / chat screen, Pronto-branded (real logo + brand colors pulled
  from the org's own Pronto Help Center Experience Cloud site).
