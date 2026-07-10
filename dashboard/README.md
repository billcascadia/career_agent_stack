# Optional Dashboard Module

This dashboard is an optional visual workspace for Career Agent Stack. It is meant to run alongside text chat, not replace it.

The dashboard is a visibility layer. Chat remains the operator, and the local `config/` and `data/` files remain the source of truth.

## Modes

- Chat Only: the user works entirely through the agent conversation.
- Dashboard + Chat: the user keeps the agent conversation and uses this dashboard to see pipeline status, scores, resume packets, and warm-path queues.

## Run Locally

From the product root:

```powershell
npm install --prefix dashboard
npm run dashboard
```

Then open the local URL printed by Vite.

Before the dashboard opens, the root script refreshes:

```text
dashboard/public/dashboard-state.json
```

You can refresh that state manually:

```powershell
npm run dashboard:sync
```

## Remove Later

The module is intentionally isolated. To remove it:

1. Delete the `dashboard/` folder.
2. Delete `scripts/export-dashboard-state.mjs`.
3. Remove the root `dashboard:sync`, `dashboard`, `dashboard:build`, and `dashboard:preview` scripts from `package.json`.
4. Remove dashboard references from `README.md`, `docs/DASHBOARD_OPTION.md`, `setup/index.html`, and `prompts/agent-orchestrator.md`.

The core text-chat career workflow will continue to work without this folder.
