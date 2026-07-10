# Career Agent Workflow

## 1. Setup

The user runs `npm run setup` or opens `setup/index.html`.

Output:

- `config/profile.yml`
- `config/preferences.yml`

## 2. Profile Source Truth

The profile builder turns the user's resume, links, and answers into a verified source-truth profile. Any uncertain claim is marked for confirmation.

## 3. Opportunity Discovery

The opportunity scout finds or ingests jobs and writes candidates to `data/pipeline.md`.

## 4. Evaluation

The JD analyst creates a report in `reports/` with:

- fit score
- ATS probability
- cold interview probability
- warm path probability
- gaps
- application recommendation

## 5. Resume Tailoring

The resume tailor creates a role-specific resume using the selected template and writes it to `outputs/` or Google Drive.

## 6. Application Help

The application assistant drafts answers, salary responses, and upload checklists.

## 7. Warm Path

The outreach agent drafts messages to recruiters, hiring managers, or referral contacts.

## 8. Follow-Up

The follow-up agent checks applications with no response after the configured cadence.

