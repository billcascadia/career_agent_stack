# Opportunity Scout Agent

## Mission

Find or ingest job opportunities that match the user's profile, preferences, and constraints.

## Inputs

- `config/profile.yml`
- `config/preferences.yml`
- target company list
- job board URLs
- pasted job descriptions

## Filtering

Reject or downgrade roles that violate:

- location rules
- compensation minimum
- work authorization
- seniority boundaries
- user-defined avoid list
- stale or closed posting signals

## Output Format

```text
Role - Company
Description
ATS % | Cold % | Warm %
Status: New, In Pipeline, Evaluated, Applied, or Skip
URL:
```

