import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Bell,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  Mail,
  Play,
  Search,
  Settings,
  Sparkles,
  Target,
  UserRound,
  UsersRound
} from "lucide-react";
import "./styles.css";

const fallbackState = {
  generatedAt: "",
  candidate: {
    fullName: "New User",
    headline: "Career Agent Stack User"
  },
  interface: {
    mode: "chat_only",
    dashboardEnabled: false,
    dashboardRole: "Visibility layer. Chat remains the control surface."
  },
  stages: [
    { number: "01", name: "Setup Orchestrator", status: "In Progress", progress: 55 },
    { number: "02", name: "Profile Builder", status: "In Progress", progress: 35 },
    { number: "03", name: "Target Strategy", status: "Pending", progress: 0 },
    { number: "04", name: "Opportunity Scout", status: "Pending", progress: 0 },
    { number: "05", name: "JD Analyst", status: "Pending", progress: 0 },
    { number: "06", name: "Match Scorer", status: "Pending", progress: 0 },
    { number: "07", name: "Resume Tailor", status: "Pending", progress: 0 },
    { number: "08", name: "Application Assistant", status: "Pending", progress: 0 },
    { number: "09", name: "Warm Path Builder", status: "Pending", progress: 0 },
    { number: "10", name: "Tracker And Follow-Up", status: "Pending", progress: 0 },
    { number: "11", name: "Interview Prep", status: "Pending", progress: 0 },
    { number: "12", name: "Learning Loop", status: "Pending", progress: 0 }
  ],
  matches: [],
  focus: {
    ats: 0,
    cold: 0,
    warm: 0,
    overall: "0.0",
    topPriority: "Finish setup before searching"
  },
  resumePackets: [],
  warmPaths: [],
  metrics: {
    applicationsSent: 0,
    interviews: 0,
    offerConversations: 0,
    profileViews: 0,
    weeklyGoalCurrent: 0,
    weeklyGoalTarget: 5
  }
};

function useDashboardState() {
  const [state, setState] = useState(fallbackState);
  const [loadState, setLoadState] = useState("Loading local state");

  useEffect(() => {
    let cancelled = false;
    fetch("/dashboard-state.json", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`State request failed: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (!cancelled) {
          setState({ ...fallbackState, ...data });
          setLoadState("Local state loaded");
        }
      })
      .catch(() => {
        if (!cancelled) setLoadState("Using fallback state");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return [state, loadState];
}

function App() {
  const [state, loadState] = useDashboardState();
  const preferredMode = state.interface?.mode === "dashboard_plus_chat" ? "dashboard" : "chat";
  const [mode, setMode] = useState(preferredMode);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("warm");

  useEffect(() => {
    setMode(preferredMode);
  }, [preferredMode]);

  const matches = state.matches?.length ? state.matches : fallbackState.matches;
  const sortedMatches = useMemo(() => {
    return [...matches].sort((a, b) => Number(b[sort] || 0) - Number(a[sort] || 0));
  }, [matches, sort]);

  return (
    <main className="app-shell">
      <Sidebar mode={mode} setMode={setMode} loadState={loadState} />
      <section className="workspace">
        <Topbar query={query} setQuery={setQuery} />
        <div className="workspace-inner">
          <header className="hero-row">
            <div>
              <h1>Career Command Center</h1>
              <p>Visibility layer for the career production line. Chat remains the control surface.</p>
            </div>
            <div className="mode-switch" role="group" aria-label="Workspace mode">
              <button className={mode === "chat" ? "selected" : ""} onClick={() => setMode("chat")}>Chat Only</button>
              <button className={mode === "dashboard" ? "selected" : ""} onClick={() => setMode("dashboard")}>Dashboard + Chat</button>
            </div>
          </header>

          <div className="layout-grid">
            <ProductionLine stages={state.stages || fallbackState.stages} />
            <FocusPanel focus={state.focus || fallbackState.focus} />
            <PriorityMatches sort={sort} setSort={setSort} rows={sortedMatches} />
            <aside className="right-stack">
              <ResumePackets packets={state.resumePackets || fallbackState.resumePackets} />
              <WarmPathQueue warmPaths={state.warmPaths || fallbackState.warmPaths} />
            </aside>
          </div>

          <MetricsBar metrics={state.metrics || fallbackState.metrics} />
        </div>
      </section>
    </main>
  );
}

function Sidebar({ mode, setMode, loadState }) {
  const nav = [
    [LayoutDashboard, "Dashboard"],
    [BriefcaseBusiness, "Pipeline"],
    [FileText, "Resumes"],
    [UsersRound, "Warm Paths"],
    [ClipboardList, "Setup"],
    [Settings, "Settings"]
  ];
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><Sparkles size={20} /></div>
        <span>Career Agent Stack</span>
      </div>
      <nav>
        {nav.map(([Icon, label], index) => (
          <button className={index === 0 ? "active" : ""} key={label}>
            <Icon size={19} />
            {label}
          </button>
        ))}
      </nav>
      <div className="assistant-card">
        <strong>Optional Dashboard</strong>
        <p>Visibility only. Keep chat as the operator, add this command center, or remove it later.</p>
        <button onClick={() => setMode(mode === "dashboard" ? "chat" : "dashboard")}>
          {mode === "dashboard" ? "Use Chat Only" : "Enable Dashboard"}
        </button>
      </div>
      <div className="plan-card">
        <span>Data Source</span>
        <strong>{loadState}</strong>
      </div>
    </aside>
  );
}

function Topbar({ query, setQuery }) {
  return (
    <header className="topbar">
      <label className="search-box">
        <Search size={20} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search jobs, companies, skills, or agents"
        />
        <kbd>/</kbd>
      </label>
      <button className="primary-action"><Play size={17} />Run Search</button>
      <button className="icon-button" aria-label="Notifications"><Bell size={20} /></button>
      <div className="avatar"><UserRound size={20} /></div>
    </header>
  );
}

function ProductionLine({ stages }) {
  return (
    <section className="panel production-panel">
      <div className="panel-title">
        <div>
          <h2>Agent Production Line</h2>
          <p>12-stage workflow. Click a stage to view inputs, outputs, and blockers.</p>
        </div>
      </div>
      <div className="stage-list">
        {stages.map((stage) => (
          <button className="stage-row" key={stage.name}>
            <span className="stage-number">{stage.number}</span>
            <strong>{stage.name}</strong>
            <span className={`status-dot ${stage.status.toLowerCase().replaceAll(" ", "-")}`} />
            <span className="stage-status">{stage.status}</span>
            <span className="stage-progress">{stage.progress}%</span>
            <ChevronRight size={17} />
          </button>
        ))}
      </div>
    </section>
  );
}

function FocusPanel({ focus }) {
  const stats = [
    ["ATS Match", `${focus.ats}%`, "Average across visible matches", "blue"],
    ["Cold Interview", `${focus.cold}%`, "Without referral or warm path", "orange"],
    ["Warm Path", `${focus.warm}%`, "With referral or direct connection", "green"],
    ["Overall Fit", `${focus.overall} / 5`, "Composite fit estimate", "blue"]
  ];
  return (
    <section className="panel focus-panel">
      <h2>Today's Focus</h2>
      <p>Live signals from your local pipeline export.</p>
      <div className="focus-grid">
        {stats.map(([label, value, note, tone]) => (
          <div className="metric-card" key={label}>
            <span>{label}</span>
            <strong className={tone}>{value}</strong>
            <small>{note}</small>
          </div>
        ))}
      </div>
      <button className="priority-callout">
        <Target size={28} />
        <span>
          <strong>Top Priority</strong>
          {focus.topPriority}
        </span>
        <ChevronRight size={18} />
      </button>
    </section>
  );
}

function PriorityMatches({ sort, setSort, rows }) {
  return (
    <section className="panel matches-panel">
      <div className="panel-title">
        <div>
          <h2>Priority Matches <span>{rows.length} Active</span></h2>
          <p>Top opportunities ranked by your fit and interview potential.</p>
        </div>
        <div className="sort-controls">
          <button className={sort === "warm" ? "selected" : ""} onClick={() => setSort("warm")}>Warm %</button>
          <button className={sort === "ats" ? "selected" : ""} onClick={() => setSort("ats")}>ATS %</button>
          <button className={sort === "cold" ? "selected" : ""} onClick={() => setSort("cold")}>Cold %</button>
        </div>
      </div>
      <div className="match-table">
        <div className="table-head">
          <span>Role</span><span>Company</span><span>Location</span><span>Salary</span><span>ATS</span><span>Cold</span><span>Warm</span><span>Status</span><span>Action</span>
        </div>
        {rows.map((match) => (
          <div className="match-row" key={match.id || `${match.company}-${match.role}`}>
            <span className={`role-badge ${match.color || "blue"}`}>{match.role?.[0] || "R"}</span>
            <strong>{match.role}</strong>
            <span>{match.company}</span>
            <span>{match.location}</span>
            <span>{match.salary}</span>
            <span className="good">{match.ats}%</span>
            <span className="caution">{match.cold}%</span>
            <span className="good">{match.warm}%</span>
            <span className="pill">{match.status}</span>
            <button>Review</button>
          </div>
        ))}
      </div>
    </section>
  );
}

function ResumePackets({ packets }) {
  return (
    <section className="panel stack-panel">
      <div className="panel-title compact">
        <h2>Resume Packets</h2>
        <a href="#resumes">View all</a>
      </div>
      {packets.map((packet) => (
        <div className={`packet-row ${packet.tone === "warning" ? "warning" : ""}`} key={`${packet.label}-${packet.title}`}>
          {packet.tone === "warning" ? <Gauge size={20} /> : <FileText size={20} />}
          <span><small>{packet.label}</small><strong>{packet.title}</strong></span>
          {packet.tone === "success" ? <em>{packet.state}</em> : <button>{packet.state}</button>}
        </div>
      ))}
    </section>
  );
}

function WarmPathQueue({ warmPaths }) {
  return (
    <section className="panel stack-panel">
      <div className="panel-title compact">
        <h2>Warm Path Queue</h2>
        <a href="#warm-paths">View all</a>
      </div>
      {warmPaths.map((pathItem) => (
        <button className="warm-row" key={`${pathItem.name}-${pathItem.role}`}>
          <span className="mini-avatar">{pathItem.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>
          <span><strong>{pathItem.name}</strong><small>{pathItem.role}</small></span>
          <span><strong>{pathItem.request}</strong><small>{pathItem.state}</small></span>
          <ChevronRight size={17} />
        </button>
      ))}
    </section>
  );
}

function MetricsBar({ metrics }) {
  const metricItems = [
    [Mail, "Applications Sent", metrics.applicationsSent, "From applications tracker"],
    [CheckCircle2, "Interviews", metrics.interviews, "Statuses with interview"],
    [BriefcaseBusiness, "Offer Conversations", metrics.offerConversations, "Statuses with offer"],
    [GraduationCap, "Profile Views", metrics.profileViews, "Manual or integration input"]
  ];
  const goalTarget = metrics.weeklyGoalTarget || 5;
  const goalCurrent = metrics.weeklyGoalCurrent || 0;
  const goalPercent = Math.max(0, Math.min(100, (goalCurrent / goalTarget) * 100));
  return (
    <section className="metrics-bar">
      {metricItems.map(([Icon, label, value, change]) => (
        <div key={label}>
          <span><Icon size={23} /></span>
          <small>{label}</small>
          <strong>{value}</strong>
          <em>{change}</em>
        </div>
      ))}
      <div className="weekly-goal">
        <small>Weekly Goal</small>
        <strong>{goalCurrent} / {goalTarget} applications</strong>
        <span><i style={{ width: `${goalPercent}%` }} /></span>
      </div>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
