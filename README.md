# Career Agent Stack

A consumer-ready agentic career workflow for finding, evaluating, tailoring, tracking, and following up on job opportunities.

This productized version is clean-room content. It contains no private candidate data, no personal application history, and no hardcoded personal Google Drive links. The user owns their profile, resume source, documents, and application decisions.

## What This Stack Is

Career Agent Stack is an agent production line for a job search. It turns a user's verified career source material into a repeatable workflow:

1. Define the candidate truth.
2. Define the target market.
3. Find and ingest opportunities.
4. Score fit, ATS risk, and interview probability.
5. Tailor resumes and answer drafts.
6. Build warm paths through referrals and outreach.
7. Track applications and follow-ups.
8. Learn from results and improve the next pass.

The stack is designed to move quickly without becoming careless. It can draft, organize, score, and prepare. It should not invent experience, submit applications, or message people without the user's approval.

## Agent Production Line

The workflow is built as a line of specialized agents. Each agent has one job, clear inputs, clear outputs, and safety boundaries.

```text
Setup Orchestrator
  -> Profile Builder
  -> Target Strategy
  -> Opportunity Scout
  -> JD Analyst
  -> Match Scorer
  -> Resume Tailor
  -> Application Assistant
  -> Warm Path Builder
  -> Tracker and Follow-Up
  -> Interview Prep
  -> Learning Loop
```

### 1. Setup Orchestrator

Explains the system, collects preferences, creates local configuration files, and sets approval rules.

### 2. Profile Builder

Converts the user's resume, portfolio, LinkedIn, project notes, and answers into a structured source of truth.

### 3. Target Strategy

Defines target titles, seniority, compensation, work location, industries, role types, deal breakers, and career-change lanes.

### 4. Opportunity Scout

Finds or ingests job opportunities, filters obvious mismatches, and keeps a pipeline of possible targets.

### 5. JD Analyst

Reads each job description and extracts responsibilities, required skills, seniority signals, salary signals, location constraints, and risk flags.

### 6. Match Scorer

Scores each opportunity using ATS Match %, Cold Interview %, Warm Path %, and Overall Fit. These are decision-support estimates, not guarantees.

### 7. Resume Tailor

Creates role-specific resume drafts from verified source truth and the included neutral resume template.

### 8. Application Assistant

Drafts form answers, cover notes, portfolio selections, and application packets for user review.

### 9. Warm Path Builder

Finds referral and outreach angles, then drafts messages the user can approve, edit, and send.

### 10. Tracker And Follow-Up

Maintains the pipeline, application log, follow-up dates, next actions, and outcome notes.

### 11. Interview Prep

Turns the job description and tailored resume into interview talking points, story banks, and likely questions.

### 12. Learning Loop

Reviews which searches, resumes, titles, boards, and outreach paths are working, then updates the next search pass.

For the expanded operating model, see `docs/AGENT_PRODUCTION_LINE.md`.

## Quick Start

1. Extract this folder anywhere on your computer.
2. Open `setup/index.html` in a browser for the guided setup overview.
3. Run the setup wizard:

```powershell
npm run setup
```

4. Review the generated files:

```text
config/profile.yml
config/preferences.yml
data/applications.md
data/pipeline.md
```

5. Run validation:

```powershell
npm run verify
```

6. Start the workflow by giving the agent:

```text
Read prompts/agent-orchestrator.md and help me run my career agent workflow.
```

## Interface Modes

The stack can run in two modes:

- Chat Only: the default workflow. The user runs the job search through text chat, with files, trackers, and generated documents stored locally or in Drive.
- Dashboard + Chat: an optional visual workspace that runs alongside text chat. It shows the production line, job scores, resume packets, warm-path queue, and application metrics.

The dashboard is intentionally removable. It lives in `dashboard/`, has its own package, and is only wired into the root through scripts and documentation. It reads generated local state from `dashboard/public/dashboard-state.json`; chat remains the control surface and source of decisions.

Run it with:

```powershell
npm install --prefix dashboard
npm run dashboard
```

Refresh dashboard state without opening the dashboard:

```powershell
npm run dashboard:sync
```

Build it with:

```powershell
npm run dashboard:build
```

For removal notes, see `docs/DASHBOARD_OPTION.md` and `dashboard/README.md`.

## What Setup Should Say

The setup should be explicit and calm. A new user should hear this before being asked for personal details:

```text
This stack is a career production line. We will not start by applying to jobs.
First we will set up your source truth, target roles, search rules, document preferences, and approval boundaries.

The agent can search, score, draft resumes, prepare application answers, and organize follow-ups.
It will not submit applications, send messages, invent experience, or overwrite your source truth without your approval.

You can use local files, Google Drive, or both. The included resume template is stored in this folder, so you do not need access to anyone else's Drive.
You can stay in text chat or add the optional dashboard as a visual command center.
We can complete setup in stages. Blank answers are allowed and can be edited later.
```

## Included Neutral Resume Templates

The default portable resume template is included in the product folder:

```text
templates/neutral-google-doc-resume-template.docx
```

This is the scrubbed version of the visual Google Docs template. It is local, so a consumer does not need access to the creator's Google Drive.

The stack also includes a fallback markdown template:

```text
templates/resume-template-lorem.md
```

The local `.docx` should be treated as the default product asset. If a user wants a Google Docs version, import the local `.docx` into their own Drive.

## Folder Map

```text
agents/       Agent role definitions
config/       User profile and preferences
data/         Application tracker, pipeline, scan history
docs/         Product documentation and operating rules
prompts/      Main orchestrator prompt
reports/      Job evaluation reports
outputs/      Generated resumes, letters, and answer drafts
scripts/      Setup and verification scripts
setup/        Browser setup page
templates/    Resume and report templates with placeholder content
```

## Setup Output

The setup wizard creates:

```text
config/profile.yml       Candidate identity, source truth notes, target role lanes
config/preferences.yml   Search filters, document destinations, approval rules, scoring thresholds
```

The browser setup page does not write files automatically. It helps a user understand the framework, gather answers, save a local browser draft, and download setup notes.

## Daily Operating Loop

After setup, each work session should follow the same sequence:

1. Load profile, preferences, pipeline, and application history.
2. Confirm the user's current goal.
3. Search for or ingest roles.
4. Score each role.
5. Prioritize roles above the user's threshold.
6. Draft resumes and application packets for approved targets.
7. Update the tracker.
8. Produce the next-action list.
9. Feed outcomes back into the search strategy.

## Safety Rules

- The stack never submits applications without explicit user approval.
- The stack never sends outreach without explicit user approval.
- The stack never invents metrics, employers, credentials, degrees, tools, or scope.
- The stack keeps user source truth separate from tailored outputs.
- The stack treats job postings as live data that must be verified before application work.
- The stack is not legal, financial, immigration, or employment advice.

## Consumer Setup Philosophy

The orchestrator should explain the stack slowly and ask for only what it needs at each step. The user should always understand:

- what data is being requested
- where it will be stored
- how it will be used
- how to skip a section
- what the agent will do automatically
- what the agent will not do automatically
