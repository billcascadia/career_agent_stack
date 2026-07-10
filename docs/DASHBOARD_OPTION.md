# Optional Dashboard Mode

Career Agent Stack can run in two interface modes:

## Chat Only

The user works entirely through text chat. This is the simplest mode and remains the default. It is best when the user wants the agent to search, score, tailor, and track through conversation.

## Dashboard + Chat

The user keeps text chat as the control surface and opens a dashboard as the visual workspace. The dashboard is intended to show:

- setup health
- agent production-line status
- pipeline scores
- ATS Match %
- Cold Interview %
- Warm Path %
- resume packet status
- warm-path outreach queue
- application and follow-up metrics

The dashboard should not bypass approval rules. It can display actions and draft packets, but applications and outreach still require user approval.

## Data Flow

The dashboard reads a generated local state file:

```text
dashboard/public/dashboard-state.json
```

Create or refresh that file with:

```powershell
npm run dashboard:sync
```

The exporter reads:

```text
config/profile.yml or config/profile.example.yml
config/preferences.yml or config/preferences.example.yml
data/pipeline.md
data/applications.md
```

This keeps the dashboard as a visibility layer. The user still controls the workflow through chat, and the local files remain the source of truth.

## Why It Is Optional

The dashboard is an experiment. It can be valuable for users who need a command center, but it should not make the core workflow heavier. The production stack should remain useful even if the dashboard is removed.

## Removal Boundary

The dashboard lives in `dashboard/`. It has its own package, source files, and README. It is wired into the root only through package scripts and documentation references.

To remove the experiment, delete `dashboard/`, delete `scripts/export-dashboard-state.mjs`, and remove the root dashboard scripts.
