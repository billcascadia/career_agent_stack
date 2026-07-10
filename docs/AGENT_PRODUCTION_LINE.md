# Agent Production Line

This document explains the Career Agent Stack operating framework. It is written for a consumer user, a support operator, or an agent that needs to understand how the stack works before running it.

## Core Idea

The stack is not a single prompt. It is a production line.

Each stage receives a specific input, performs a bounded task, creates a useful output, and hands that output to the next stage. This keeps the workflow fast, auditable, and easier to improve.

```text
User setup
  -> Candidate source truth
  -> Target market definition
  -> Opportunity discovery
  -> Job description analysis
  -> Probability scoring
  -> Resume and packet drafting
  -> Warm path development
  -> Application tracking
  -> Follow-up and interview prep
  -> Learning loop
```

## Stage 1 - Setup Orchestrator

Purpose: explain the stack, collect the minimum setup information, and establish approval rules.

Inputs:

- user answers
- resume or profile source material
- target role preferences
- document destination preferences

Outputs:

- `config/profile.yml`
- `config/preferences.yml`
- clear approval boundaries

The setup orchestrator should say:

```text
This stack is a career production line. We will set up the source truth first, then define the market, then search, score, draft, and track.

You stay in control of submissions and messages. The agent can prepare materials, but it will ask before anything leaves your computer or Drive.
```

## Stage 2 - Profile Builder

Purpose: turn messy career materials into structured source truth.

Inputs:

- resume text
- LinkedIn or portfolio links
- project notes
- user-entered achievements
- work authorization and location notes

Outputs:

- candidate headline
- role archetypes
- proof points
- verified skills
- claims that need confirmation
- claims the agent must never make

Quality rule: the profile builder should preserve facts. It should not turn wishful positioning into claimed experience.

## Stage 3 - Target Strategy

Purpose: define what the system is searching for.

Inputs:

- primary target titles
- career-change titles
- seniority range
- compensation rules
- location rules
- industries and company types
- deal breakers

Outputs:

- target role lanes
- strict filters
- stretch filters
- search keywords
- rejection rules

Example lanes:

- Primary fit: roles closely aligned with the user's current background.
- Stretch fit: roles one step beyond the current background.
- Career-change fit: adjacent roles where transferable proof points matter.

## Stage 4 - Opportunity Scout

Purpose: find, collect, and normalize job opportunities.

Inputs:

- target role lanes
- search keywords
- remote and location filters
- salary filters
- company lists or job boards

Outputs:

- pipeline entries
- source links
- posting dates
- location notes
- salary notes
- duplicate flags

The scout should favor verified postings from employer sites or reputable boards. If a posting looks stale, unclear, or duplicated, it should be flagged before resume work begins.

## Stage 5 - JD Analyst

Purpose: read the job description like a recruiter and an ATS parser.

Inputs:

- job description
- company page
- salary and location notes
- candidate profile

Outputs:

- required skills
- preferred skills
- seniority signals
- role responsibilities
- missing proof points
- likely ATS keywords
- application risks

The JD analyst should separate must-have requirements from nice-to-have requirements. This prevents the system from over-penalizing stretch roles or over-rating weak matches.

## Stage 6 - Match Scorer

Purpose: decide where to spend time.

Inputs:

- candidate source truth
- JD analysis
- pipeline history
- warm path options

Outputs:

- ATS Match %
- Cold Interview %
- Warm Path %
- Overall Fit out of 5
- Apply, maybe, or skip recommendation

Scoring definitions:

- ATS Match % estimates whether the resume can pass keyword and structure screening.
- Cold Interview % estimates the chance of an interview without referral or insider help.
- Warm Path % estimates the chance with a referral, recruiter reply, or direct connection.
- Overall Fit combines experience match, seniority, compensation, location, and strategic value.

These scores are directional. They are not promises.

## Stage 7 - Resume Tailor

Purpose: create a truthful, role-specific resume draft.

Inputs:

- verified source truth
- JD analysis
- resume template
- scoring notes

Outputs:

- tailored resume draft
- ATS keyword coverage notes
- risk notes for unsupported claims
- optional PDF or Google Doc export

Template rule: use `templates/neutral-google-doc-resume-template.docx` first. Use `templates/resume-template-lorem.md` only as a fallback.

## Stage 8 - Application Assistant

Purpose: prepare everything the user needs to apply.

Inputs:

- tailored resume
- JD analysis
- application form questions
- portfolio or work sample links

Outputs:

- short answer drafts
- cover note or cover letter draft
- portfolio selection notes
- compensation and availability answer drafts

The application assistant should produce copy-ready text, but the user decides what to submit.

## Stage 9 - Warm Path Builder

Purpose: improve interview odds through human connection.

Inputs:

- company name
- role link
- LinkedIn or network notes
- recruiter or hiring manager leads
- user-approved outreach style

Outputs:

- referral target list
- recruiter message draft
- hiring manager message draft
- follow-up message draft

The warm path builder should never send messages automatically unless the user explicitly enables that behavior and confirms the message.

## Stage 10 - Tracker And Follow-Up

Purpose: keep the search from becoming scattered.

Inputs:

- pipeline entries
- submitted applications
- outreach attempts
- user outcomes

Outputs:

- application log
- next actions
- follow-up dates
- status changes
- response notes

The tracker should answer three questions at any time:

1. What should the user do next?
2. Which opportunities are highest value?
3. Which applications need follow-up?

## Stage 11 - Interview Prep

Purpose: convert an application into an interview plan.

Inputs:

- tailored resume
- JD analysis
- company research
- user proof points

Outputs:

- likely interview questions
- story bank
- role-specific talking points
- questions to ask the employer
- risk areas to rehearse

## Stage 12 - Learning Loop

Purpose: improve the next search cycle based on evidence.

Inputs:

- application outcomes
- recruiter responses
- interview invites
- rejections
- roles that score well or poorly

Outputs:

- updated target roles
- improved keywords
- adjusted scoring thresholds
- revised resume positioning
- follow-up strategy changes

The learning loop is what makes the stack compound. Every search pass should make the next search pass more focused.

## Operating Cadence

Recommended daily cadence:

```text
Morning: scan and score new roles.
Midday: tailor materials for the strongest roles.
Afternoon: submit user-approved applications and prepare warm paths.
End of day: update tracker, schedule follow-ups, and review what worked.
```

Recommended weekly review:

```text
Review scores, submissions, replies, interviews, and dead ends.
Remove weak search terms.
Add stronger companies, titles, and keywords.
Raise or lower thresholds based on actual response data.
```

## Approval Boundaries

Default permissions:

- The agent may search.
- The agent may score jobs.
- The agent may draft resumes.
- The agent may draft answers.
- The agent may draft outreach.
- The agent may update local trackers.

Default restrictions:

- The agent may not submit applications.
- The agent may not send messages.
- The agent may not invent experience.
- The agent may not hide uncertainty.
- The agent may not publish private user data.

## What Good Looks Like

A strong run of the stack produces:

- a clean profile
- a clear target market
- a ranked pipeline
- fewer low-fit applications
- more tailored high-fit applications
- warm-path options for priority roles
- a tracker that shows next actions without guesswork
- increasingly better scoring as outcomes come in
