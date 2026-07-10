import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dashboardPublic = path.join(root, "dashboard", "public");
const statePath = path.join(dashboardPublic, "dashboard-state.json");

function readFirst(paths) {
  for (const rel of paths) {
    const full = path.join(root, rel);
    if (fs.existsSync(full)) return fs.readFileSync(full, "utf8");
  }
  return "";
}

function value(text, key, fallback = "") {
  const match = text.match(new RegExp(`^\\s*${key}:\\s*"?([^"\\n]*)"?\\s*$`, "m"));
  return match ? match[1].trim() : fallback;
}

function boolValue(text, key, fallback = false) {
  const raw = value(text, key, String(fallback));
  return raw.toLowerCase() === "true";
}

function listUnder(text, key) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `${key}:`);
  if (start === -1) return [];
  const items = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.startsWith("    ") && line.trim() && !line.trim().startsWith("-")) break;
    const item = line.match(/^\s*-\s*"?([^"]*)"?\s*$/);
    if (item && item[1]) items.push(item[1]);
  }
  return items;
}

function parseScore(score) {
  const numbers = String(score).match(/\d+/g);
  if (!numbers) return {};
  if (numbers.length >= 3) {
    return {
      ats: Number(numbers[0]),
      cold: Number(numbers[1]),
      warm: Number(numbers[2])
    };
  }
  return { ats: Number(numbers[0]) };
}

function statusFromProgress(progress) {
  if (progress >= 100) return "Complete";
  if (progress > 0) return "In Progress";
  return "Pending";
}

function parseApplications(markdown) {
  return markdown
    .split(/\r?\n/)
    .filter((line) => line.startsWith("|") && !line.includes("---") && !line.includes("| # |"))
    .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()))
    .filter((cells) => cells.length >= 9)
    .map(([id, date, company, role, score, status, resume, report, url, notes]) => ({
      id,
      date,
      company,
      role,
      status,
      resume,
      report,
      url,
      notes,
      salary: "",
      location: "",
      ...parseScore(score)
    }));
}

function parsePipeline(markdown) {
  return markdown
    .split(/\r?\n/)
    .map((line) => line.match(/^- \[[ xX]\]\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*$/))
    .filter(Boolean)
    .map((match, index) => ({
      id: `pipeline-${index + 1}`,
      url: match[1],
      company: match[2],
      role: match[3],
      location: "Needs review",
      salary: "Needs review",
      ats: 70,
      cold: 30,
      warm: 45,
      status: "Pipeline"
    }));
}

function resumePackets(matches, preferencesText) {
  const template = value(preferencesText, "resume_template", "templates/neutral-google-doc-resume-template.docx");
  const latest = matches[0];
  return [
    {
      label: "Active Template",
      title: template.includes("neutral-google-doc") ? "Neutral Google Doc Template" : template,
      state: "In Use",
      tone: "success"
    },
    {
      label: "Latest Tailored Resume",
      title: latest ? `${latest.role} - ${latest.company}` : "No tailored resume yet",
      state: latest ? "Open" : "Waiting",
      tone: latest ? "default" : "muted"
    },
    {
      label: "Approval Needed",
      title: latest ? "Review generated packets before submitting" : "No packets awaiting review",
      state: latest ? "Review" : "Clear",
      tone: latest ? "warning" : "muted"
    }
  ];
}

function warmPathQueue(matches) {
  return matches.slice(0, 3).map((match, index) => ({
    name: ["Referral Contact", "Recruiter Contact", "Hiring Lead"][index] || "Network Contact",
    role: `${match.company} warm path`,
    request: index === 0 ? "Referral Request" : index === 1 ? "Intro Request" : "General Outreach",
    state: "Draft needed"
  }));
}

const profileText = readFirst(["config/profile.yml", "config/profile.example.yml"]);
const preferencesText = readFirst(["config/preferences.yml", "config/preferences.example.yml"]);
const applicationsText = readFirst(["data/applications.md"]);
const pipelineText = readFirst(["data/pipeline.md"]);

const applications = parseApplications(applicationsText);
const pipeline = parsePipeline(pipelineText);
const matches = [...applications, ...pipeline]
  .filter((item) => item.company && item.role)
  .map((item, index) => ({
    id: item.id || `match-${index + 1}`,
    role: item.role,
    company: item.company,
    location: item.location || "Needs review",
    salary: item.salary || "Needs review",
    ats: item.ats || 70,
    cold: item.cold || 30,
    warm: item.warm || 45,
    status: item.status || "New",
    url: item.url || "",
    color: ["blue", "violet", "teal", "orange"][index % 4]
  }));

const stageProgress = {
  "Setup Orchestrator": profileText.includes("Needs user input") ? 55 : 100,
  "Profile Builder": profileText.includes("Lorem Ipsum") ? 35 : 100,
  "Target Strategy": listUnder(profileText, "primary").length ? 100 : 0,
  "Opportunity Scout": pipeline.length ? 72 : 0,
  "JD Analyst": matches.length ? 55 : 0,
  "Match Scorer": matches.length ? 50 : 0,
  "Resume Tailor": applications.some((app) => app.resume) ? 65 : 0,
  "Application Assistant": applications.length ? 45 : 0,
  "Warm Path Builder": matches.length ? 20 : 0,
  "Tracker And Follow-Up": applications.length ? 40 : 0,
  "Interview Prep": applications.some((app) => /interview/i.test(app.status)) ? 45 : 0,
  "Learning Loop": applications.length >= 5 ? 35 : 0
};

const stages = Object.entries(stageProgress).map(([name, progress], index) => ({
  number: String(index + 1).padStart(2, "0"),
  name,
  status: statusFromProgress(progress),
  progress
}));

const topMatches = matches.length ? matches : [
  {
    id: "sample-1",
    role: "Example Role",
    company: "Example Company",
    location: "Needs review",
    salary: "Needs review",
    ats: 70,
    cold: 30,
    warm: 45,
    status: "Sample",
    url: "https://example.com/job",
    color: "blue"
  }
];

const average = (key) => Math.round(topMatches.reduce((sum, item) => sum + Number(item[key] || 0), 0) / topMatches.length);
const applied = applications.filter((app) => /applied|submitted/i.test(app.status)).length;
const interviews = applications.filter((app) => /interview/i.test(app.status)).length;
const offers = applications.filter((app) => /offer/i.test(app.status)).length;
const maxDaily = Number(value(preferencesText, "max_daily_applications", "5")) || 5;
const dashboardEnabled = boolValue(preferencesText, "dashboard_enabled", false);

const state = {
  generatedAt: new Date().toISOString(),
  candidate: {
    fullName: value(profileText, "full_name", "New User"),
    headline: value(profileText, "headline", "Career Agent Stack User")
  },
  interface: {
    mode: value(preferencesText, "mode", dashboardEnabled ? "dashboard_plus_chat" : "chat_only"),
    dashboardEnabled,
    dashboardRole: "Visibility layer. Chat remains the control surface."
  },
  stages,
  matches: topMatches,
  focus: {
    ats: average("ats"),
    cold: average("cold"),
    warm: average("warm"),
    overall: Math.max(1, Math.min(5, (average("ats") / 20))).toFixed(1),
    topPriority: topMatches.length
      ? `Review ${Math.min(topMatches.length, maxDaily)} role${Math.min(topMatches.length, maxDaily) === 1 ? "" : "s"} before drafting packets`
      : "Finish setup before searching"
  },
  resumePackets: resumePackets(topMatches, preferencesText),
  warmPaths: warmPathQueue(topMatches),
  metrics: {
    applicationsSent: applied,
    interviews,
    offerConversations: offers,
    profileViews: 0,
    weeklyGoalCurrent: Math.min(applied, maxDaily),
    weeklyGoalTarget: maxDaily
  }
};

fs.mkdirSync(dashboardPublic, { recursive: true });
fs.writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
console.log(`Dashboard state exported to ${path.relative(root, statePath)}`);
