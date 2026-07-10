import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "README.md",
  "AGENTS.md",
  "prompts/agent-orchestrator.md",
  "config/profile.example.yml",
  "config/preferences.example.yml",
  "data/applications.md",
  "data/pipeline.md",
  "data/scan-history.tsv",
  "docs/AGENT_PRODUCTION_LINE.md",
  "docs/DASHBOARD_OPTION.md",
  "templates/neutral-google-doc-resume-template.docx",
  "templates/resume-template-lorem.md",
  "setup/index.html"
];

const dashboardRequired = [
  "dashboard/README.md",
  "dashboard/package.json",
  "dashboard/index.html",
  "dashboard/public/dashboard-state.json",
  "dashboard/src/main.jsx",
  "dashboard/src/styles.css"
];

const defaultForbidden = [
  "PRIVATE_CANDIDATE_NAME",
  "PRIVATE_EMAIL",
  "PRIVATE_PHONE",
  "PRIVATE_EMPLOYER",
  "PRIVATE_LOCATION"
];

const localDenylistPath = path.join(root, "config", "private-denylist.local.txt");
const localForbidden = fs.existsSync(localDenylistPath)
  ? fs.readFileSync(localDenylistPath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
  : [];

const forbidden = [...defaultForbidden, ...localForbidden];

let errors = 0;

for (const rel of required) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    console.error(`Missing required file: ${rel}`);
    errors += 1;
  }
}

if (fs.existsSync(path.join(root, "dashboard"))) {
  for (const rel of dashboardRequired) {
    const full = path.join(root, rel);
    if (!fs.existsSync(full)) {
      console.error(`Missing dashboard file: ${rel}`);
      errors += 1;
    }
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist") continue;
      walk(full);
      continue;
    }
    const rel = path.relative(root, full);
    if (rel === path.join("scripts", "verify-stack.mjs")) continue;
    const text = fs.readFileSync(full, "utf8");
    for (const bad of forbidden) {
      if (text.includes(bad)) {
        console.error(`Forbidden private token found in ${rel}: ${bad}`);
        errors += 1;
      }
    }
  }
}

walk(root);

const appText = fs.readFileSync(path.join(root, "data", "applications.md"), "utf8");
if (!appText.includes("| # | Date | Company | Role | Score | Status | Resume | Report | URL | Notes |")) {
  console.error("applications.md header is invalid.");
  errors += 1;
}

if (errors > 0) {
  console.error(`Verification failed with ${errors} error(s).`);
  process.exit(1);
}

console.log("Career Agent Stack verification passed.");
