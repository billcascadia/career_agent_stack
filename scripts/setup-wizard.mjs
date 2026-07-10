import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const root = process.cwd();
const rl = readline.createInterface({ input, output });

async function ask(label, fallback = "") {
  const suffix = fallback ? ` [${fallback}]` : "";
  const answer = (await rl.question(`${label}${suffix}: `)).trim();
  return answer || fallback;
}

function list(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function yamlList(items, indent = 4) {
  if (!items.length) return `${" ".repeat(indent)}- ""`;
  return items.map((item) => `${" ".repeat(indent)}- "${item.replaceAll('"', '\\"')}"`).join("\n");
}

function section(title, body) {
  console.log("");
  console.log(title);
  console.log("-".repeat(title.length));
  if (body) console.log(body);
  console.log("");
}

console.log("");
console.log("Career Agent Stack Setup");
console.log("========================");
console.log("");
console.log("This stack is a career production line, not a one-off resume generator.");
console.log("We will set up source truth, target roles, search rules, document preferences, and approval boundaries.");
console.log("");
console.log("The agent can search, score, draft resumes, prepare application answers, and organize follow-ups.");
console.log("It will not submit applications, send messages, invent experience, or overwrite source truth without approval.");
console.log("");
console.log("You can use local files, Google Drive, or both.");
console.log("The default resume template is included in this folder, so no external Drive access is required.");
console.log("Blank answers are allowed. You can edit the generated files later.");

section("Agent Production Line", "Setup Orchestrator -> Profile Builder -> Target Strategy -> Opportunity Scout -> JD Analyst -> Match Scorer -> Resume Tailor -> Application Assistant -> Warm Path Builder -> Tracker And Follow-Up -> Interview Prep -> Learning Loop");

section("1. Identity And Contact", "Used for resume headers, application answers, and profile files.");
const fullName = await ask("Full name", "Lorem Ipsum");
const email = await ask("Email", "lorem.ipsum@example.com");
const phone = await ask("Phone", "+1-555-0100");
const location = await ask("Location", "City, State, Country");
const linkedin = await ask("LinkedIn", "linkedin.com/in/loremipsum");
const portfolio = await ask("Portfolio or website", "https://example.com");
const workAuth = await ask("Work authorization", "Needs user confirmation");

section("2. Source Truth", "Used to prevent hallucinated experience. The agent should tailor from verified facts only.");
const sourceMethod = await ask("Source truth method: paste, local_file, google_doc, linkedin_portfolio", "paste");
const sourceLocation = await ask("Source file, Google Doc URL, or notes", "");
const verifiedNotes = await ask("Verified achievements or proof points", "Needs user input");
const avoidClaims = await ask("Claims, skills, or role types the agent should avoid", "Anything not verified by the user");

section("3. Target Roles", "Use commas between roles. Include both primary and adjacent lanes if useful.");
const primaryRoles = list(await ask("Primary target roles", "Senior Role Title, Lead Role Title, Manager Role Title"));
const careerChangeRoles = list(await ask("Career-change or adjacent roles", "Adjacent Role Title, Stretch Role Title"));
const avoidRoles = list(await ask("Roles to avoid", "Junior roles, commission-only roles"));

section("4. Location And Compensation", "These filters prevent wasted applications.");
const remote = await ask("Remote preference", "remote only");
const countries = list(await ask("Eligible countries", "United States"));
const statesOrRegions = list(await ask("Eligible states or regions", ""));
const minimumComp = await ask("Minimum compensation", "");
const targetComp = await ask("Target compensation", "");
const employmentType = await ask("Employment type preference", "full-time");

section("5. Documents And Storage", "Choose where resumes, application packets, and tracker outputs should be stored.");
const outputDestination = await ask("Output destination: local, google_drive, or both", "local");
const driveFolder = outputDestination.includes("google") || outputDestination === "both"
  ? await ask("Google Drive folder URL", "")
  : "";
const templateChoice = await ask("Resume template", "templates/neutral-google-doc-resume-template.docx");

section("6. Interface Mode", "Choose whether the workflow should stay in text chat or also expose a visual dashboard.");
const interfaceMode = await ask("Interface mode: chat_only or dashboard_plus_chat", "chat_only");

section("7. Search Strategy", "Cadence controls how often the stack should scan or ingest new roles.");
const cadence = await ask("Search cadence: manual, daily, twice_daily, weekly", "manual");
const boards = list(await ask("Preferred job boards or company lists", "Employer career sites, LinkedIn, Indeed"));
const includeCareerChange = await ask("Include career-change roles? yes or no", "yes");

section("8. Approval Rules", "Default safety boundary: draft and organize first, then ask before anything is submitted or sent.");
const maxDailyApplications = await ask("Maximum user-approved applications per day", "5");
const allowAutoOutreachDrafts = await ask("Allow outreach drafts? yes or no", "yes");

const profile = `candidate:
  full_name: "${fullName}"
  email: "${email}"
  phone: "${phone}"
  location: "${location}"
  linkedin: "${linkedin}"
  portfolio_url: "${portfolio}"
  github: ""
  work_authorization: "${workAuth}"

source_materials:
  method: "${sourceMethod}"
  location_or_notes: "${sourceLocation}"
  verified_notes: "${verifiedNotes}"
  claims_to_avoid:
${yamlList(list(avoidClaims), 4)}

target_roles:
  primary:
${yamlList(primaryRoles)}
  career_change:
${yamlList(careerChangeRoles)}
  avoid:
${yamlList(avoidRoles)}
  archetypes:
    - name: "Primary Archetype"
      level: "Senior"
      fit: "primary"
    - name: "Adjacent Archetype"
      level: "Mid-Senior"
      fit: "secondary"

narrative:
  headline: "Needs user input"
  exit_story: "Needs user input"
  superpowers:
    - "Needs user input"
  proof_points:
    - name: "Needs user input"
      url: ""
      hero_metric: "Needs user input"

source_truth_rules:
  never_claim:
${yamlList(list(avoidClaims), 4)}
  needs_confirmation:
    - "Metrics, credentials, tools, and work authorization"
`;

const preferences = `documents:
  output_destination: "${outputDestination}"
  local_output_folder: "outputs"
  google_drive_enabled: ${outputDestination.includes("google") || outputDestination === "both"}
  google_drive_folder_url: "${driveFolder}"
  resume_template: "${templateChoice}"
  fallback_markdown_template: "templates/resume-template-lorem.md"
  export_formats:
    - "google_doc"
    - "pdf"

interface:
  mode: "${interfaceMode}"
  dashboard_enabled: ${interfaceMode === "dashboard_plus_chat"}
  dashboard_path: "dashboard"
  dashboard_notes: "Optional visual command center. Text chat remains the source of control."

search:
  cadence: "${cadence}"
  remote_preference: "${remote}"
  countries:
${yamlList(countries)}
  states_or_regions:
${yamlList(statesOrRegions)}
  minimum_compensation: "${minimumComp}"
  target_compensation: "${targetComp}"
  employment_type: "${employmentType}"
  include_career_change_roles: ${includeCareerChange.toLowerCase().startsWith("y")}
  preferred_sources:
${yamlList(boards)}
  max_daily_applications: ${Number.parseInt(maxDailyApplications, 10) || 5}

approval_rules:
  allow_auto_search: true
  allow_auto_resume_drafts: true
  allow_auto_outreach_drafts: ${allowAutoOutreachDrafts.toLowerCase().startsWith("y")}
  allow_auto_submit_applications: false
  allow_auto_send_messages: false

scoring:
  minimum_ats_for_resume: 70
  minimum_overall_fit_for_application: 3.8
  prioritize_warm_path: true
`;

fs.writeFileSync(path.join(root, "config", "profile.yml"), profile);
fs.writeFileSync(path.join(root, "config", "preferences.yml"), preferences);

console.log("");
console.log("Setup complete.");
console.log("Created config/profile.yml and config/preferences.yml.");
console.log("Next: run npm run verify, then ask your agent to read prompts/agent-orchestrator.md.");

rl.close();
