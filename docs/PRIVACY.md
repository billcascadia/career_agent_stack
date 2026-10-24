# Privacy And Data Safety

This stack is designed for consumer use. Career data is sensitive.

## Product Rules

- Keep private profile data in `config/profile.yml`, not in public templates.
- Keep tailored outputs in `outputs/`.
- Keep evaluation notes in `reports/`.
- Do not include private source data in docs meant for resale or sharing.
- Do not commit real user profile files.

`.gitignore` keeps `config/profile.yml`, `config/preferences.yml`, `config/private-denylist.local.txt`, `dashboard/public/dashboard-state.json`, `outputs/`, and `reports/*.private.md` out of git.

## Leak Check

Before sharing or publishing the stack, list your real name, email, phone, employers, and locations in `config/private-denylist.local.txt`, one per line, then run `npm run verify`. It scans every shareable file, including the contents of `.docx` and `.zip` files, and fails if any of those values appear. The gitignored private files above are skipped because they are supposed to contain your details.

## Public Template Rules

Public templates must use:

- lorem ipsum names
- example.com links
- generic employers
- generic roles
- generic metrics

## Agent Rules

The agent must:

- ask before using Google Drive
- ask before creating public links
- ask before sending messages
- ask before submitting applications
- flag uncertainty instead of guessing

