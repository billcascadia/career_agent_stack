import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

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

// Files that are meant to hold the user's real details. They are gitignored, so the scan skips them.
const privatePaths = [
  "config/profile.yml",
  "config/preferences.yml",
  "config/private-denylist.local.txt",
  "dashboard/public/dashboard-state.json"
];
const privateDirs = ["outputs"];

function isPrivate(rel) {
  const posix = rel.split(path.sep).join("/");
  if (privatePaths.includes(posix)) return true;
  if (privateDirs.some((dir) => posix.startsWith(`${dir}/`))) return true;
  return /^reports\/.*\.private\.md$/.test(posix);
}

// Returns [name, data] for every entry in a zip-based file (.zip, .docx), so compressed contents are scanned too.
function zipEntries(buffer) {
  const entries = [];
  let eocd = buffer.length - 22;
  while (eocd >= 0 && buffer.readUInt32LE(eocd) !== 0x06054b50) eocd -= 1;
  if (eocd < 0) return null;
  const count = buffer.readUInt16LE(eocd + 10);
  let offset = buffer.readUInt32LE(eocd + 16);
  for (let index = 0; index < count; index += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) return null;
    const method = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const name = buffer.toString("utf8", offset + 46, offset + 46 + nameLength);
    const dataStart = localOffset + 30 + buffer.readUInt16LE(localOffset + 26) + buffer.readUInt16LE(localOffset + 28);
    const raw = buffer.subarray(dataStart, dataStart + compressedSize);
    const data = method === 8 ? zlib.inflateRawSync(raw) : raw;
    entries.push([name, data]);
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}

let errors = 0;

function scan(label, data) {
  // This script lists the placeholder tokens itself, including copies of it inside archives.
  if (label.replaceAll("\\", "/").endsWith("scripts/verify-stack.mjs")) return;
  const nested = /\.(zip|docx|xlsx|pptx)$/i.test(label) ? zipEntries(data) : null;
  if (nested) {
    for (const [name, entryData] of nested) scan(`${label} > ${name}`, entryData);
  }
  const text = data.toString("utf8").toLowerCase();
  for (const bad of forbidden) {
    if (text.includes(bad.toLowerCase())) {
      console.error(`Forbidden private token found in ${label}: ${bad}`);
      errors += 1;
    }
  }
  if (nested) {
    for (const [name] of nested) {
      if (name.includes("\\")) {
        console.error(`Archive entry uses backslash paths and will not unzip correctly on macOS or Linux: ${label} > ${name}`);
        errors += 1;
        break;
      }
    }
  }
}

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
    if (isPrivate(rel)) continue;
    scan(rel.split(path.sep).join("/"), fs.readFileSync(full));
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
