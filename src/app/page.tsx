"use client";
import { useState, useEffect, useCallback } from "react";

const SB_URL = "https://cpqqcydlwdiciumefzzk.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwcXFjeWRsd2RpY2l1bWVmenprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MzMwNzEsImV4cCI6MjA5MTIwOTA3MX0.C1M83kBzeA6YnSXhAffMLsO8VdMIBjR03vgjSYl8D3I";

const PRODUCTS = [
  {
    name: "Customer Retention System", tag: "Core Product", price: "$2,000 setup + $449/mo",
    description: "QR code → customer opts in → SMS database → automated follow-up",
    includes: ["Custom QR code + branded stickers shipped","Client-owned customer database","SMS dashboard (5,000 SMS/mo)","Automated review funnel (5★→Google, 1-3★→private)","3-message welcome sequence","60–90 min guided onboarding call"],
    guarantee: "50 contacts in 30 days or free extended support",
  },
];

const ADDONS = [
  { icon: "🌐", name: "Website Creation", desc: "Conversion-optimized, SEO-ready local business sites" },
  { icon: "⭐", name: "Google Review Management", desc: "Respond to reviews, reputation campaigns, grow ratings" },
  { icon: "🤖", name: "Voice AI Receptionist", desc: "AI answers calls, books appointments 24/7" },
  { icon: "💬", name: "Smart Chat Widget", desc: "AI chat that qualifies leads + books appointments" },
];

const TEAM = [
  { name: "Hans", role: "CEO / Co-Founder", focus: "Sales, strategy, growth", initial: "H" },
  { name: "Lars", role: "CEO / Co-Founder", focus: "Sales, growth, client relations", initial: "L" },
  { name: "Felix", role: "AI Operating Partner", focus: "Operations, tech, execution, proactive growth", initial: "⚡" },
];

const PRIORITY_COLOR: Record<string, string> = {
  high: "text-red-400", medium: "text-yellow-400", low: "text-slate-400"
};

const CATEGORY_COLORS: Record<string, string> = {
  "Company": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Sales": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Market": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Tech": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Finance": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "General": "bg-slate-500/20 text-slate-400 border-slate-500/30",
  "Brand": "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "Operations": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  "EternalLine": "bg-violet-500/20 text-violet-400 border-violet-500/30",
};

type Tab = "tasks" | "brain" | "products" | "team";
type TaskStatus = "recommended" | "upcoming" | "finished";
type Task = { id: string; title: string; description?: string; priority: string; category: string; assigned_to: string; status: TaskStatus; created_at: string; };
type BrainEntry = { id: string; title: string; content: string; category: string; created_at: string; };

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor(diff / 60000);
  if (h > 23) return `${Math.floor(h / 24)}d ago`;
  if (h > 0) return `${h}h ago`;
  return `${m}m ago`;
}

function sbHeaders() {
  return { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" };
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("tasks");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [brain, setBrain] = useState<BrainEntry[]>([]);
  const [brainLoading, setBrainLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [taskTab, setTaskTab] = useState<TaskStatus>("recommended");

  const fetchTasks = useCallback(() => {
    setTasksLoading(true);
    fetch(`${SB_URL}/rest/v1/tasks?select=*&order=created_at.asc`, { headers: sbHeaders() })
      .then(r => r.json())
      .then(d => { setTasks(Array.isArray(d) ? d : []); setTasksLoading(false); })
      .catch(() => setTasksLoading(false));
  }, []);

  useEffect(() => { if (tab === "tasks") fetchTasks(); }, [tab, fetchTasks]);

  useEffect(() => {
    if (tab === "brain") {
      setBrainLoading(true);
      fetch(`${SB_URL}/rest/v1/brain_entries?select=*&order=created_at.desc&limit=50`, { headers: sbHeaders() })
        .then(r => r.json())
        .then(d => { setBrain(Array.isArray(d) ? d : []); setBrainLoading(false); })
        .catch(() => setBrainLoading(false));
    }
  }, [tab]);

  const updateStatus = async (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    await fetch(`${SB_URL}/rest/v1/tasks?id=eq.${id}`, {
      method: "PATCH", headers: sbHeaders(), body: JSON.stringify({ status })
    });
  };

  const recommended = tasks.filter(t => t.status === "recommended");
  const upcoming = tasks.filter(t => t.status === "upcoming");
  const finished = tasks.filter(t => t.status === "finished");

  return (
    <div className="max-w-lg mx-auto px-4 pb-24">
      {/* Header */}
      <div className="pt-12 pb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">⚡</span>
          <h1 className="text-2xl font-extrabold tracking-tight">WFC Command</h1>
        </div>
        <p className="text-slate-400 text-sm ml-11">Felix is running. Everything tracked.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Recommended", value: recommended.length, color: "text-yellow-400" },
          { label: "Upcoming", value: upcoming.length, color: "text-blue-400" },
          { label: "Finished", value: finished.length, color: "text-emerald-400" },
        ].map((s) => (
          <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-slate-500 text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-6 border border-white/10">
        {(["tasks", "brain", "products", "team"] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${tab === t ? "bg-[#22C55E] text-white" : "text-slate-400 hover:text-white"}`}>
            {t === "brain" ? "🧠" : t === "tasks" ? "⚡" : t === "products" ? "📦" : "👥"} {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Tasks Tab */}
      {tab === "tasks" && (
        <div>
          {/* Task Stage Tabs */}
          <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-4 border border-white/10">
            {([
              { key: "recommended", label: "📋 Recommended", count: recommended.length },
              { key: "upcoming", label: "🔄 Upcoming", count: upcoming.length },
              { key: "finished", label: "✅ Finished", count: finished.length },
            ] as { key: TaskStatus; label: string; count: number }[]).map(s => (
              <button key={s.key} onClick={() => setTaskTab(s.key)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${taskTab === s.key ? "bg-white/15 text-white" : "text-slate-500 hover:text-white"}`}>
                {s.label}
                <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${taskTab === s.key ? "bg-[#22C55E] text-white" : "bg-white/10 text-slate-400"}`}>{s.count}</span>
              </button>
            ))}
          </div>

          {tasksLoading && <div className="text-center py-12 text-slate-500 text-sm">Loading...</div>}

          {/* Recommended */}
          {!tasksLoading && taskTab === "recommended" && (
            <div className="space-y-3">
              <p className="text-slate-400 text-xs mb-3">Felix's suggestions — check off to move to Upcoming.</p>
              {recommended.length === 0 && <div className="text-center py-12 text-slate-500 text-sm">No recommended tasks right now.</div>}
              {recommended.map(task => (
                <div key={task.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-sm leading-snug flex-1">{task.title}</p>
                    <span className={`text-xs font-bold uppercase ${PRIORITY_COLOR[task.priority] || "text-slate-400"}`}>{task.priority}</span>
                  </div>
                  {task.description && <p className="text-slate-400 text-xs leading-relaxed mb-3">{task.description}</p>}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${CATEGORY_COLORS[task.category] || CATEGORY_COLORS["General"]}`}>{task.category}</span>
                    <span className="text-slate-500 text-xs">→ {task.assigned_to}</span>
                  </div>
                  <button onClick={() => updateStatus(task.id, "upcoming")}
                    className="w-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-bold py-2 rounded-lg hover:bg-[#22C55E]/20 transition-all">
                    ✓ Approve → Move to Upcoming
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upcoming */}
          {!tasksLoading && taskTab === "upcoming" && (
            <div className="space-y-3">
              <p className="text-slate-400 text-xs mb-3">Approved jobs — mark done when completed.</p>
              {upcoming.length === 0 && <div className="text-center py-12 text-slate-500 text-sm">No upcoming jobs yet. Approve tasks from Recommended.</div>}
              {upcoming.map(task => (
                <div key={task.id} className="bg-white/5 border border-blue-500/20 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-sm leading-snug flex-1">{task.title}</p>
                    <span className={`text-xs font-bold uppercase ${PRIORITY_COLOR[task.priority] || "text-slate-400"}`}>{task.priority}</span>
                  </div>
                  {task.description && <p className="text-slate-400 text-xs leading-relaxed mb-3">{task.description}</p>}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${CATEGORY_COLORS[task.category] || CATEGORY_COLORS["General"]}`}>{task.category}</span>
                    <span className="text-slate-500 text-xs">→ {task.assigned_to}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(task.id, "finished")}
                      className="flex-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold py-2 rounded-lg hover:bg-emerald-500/20 transition-all">
                      ✅ Mark Finished
                    </button>
                    <button onClick={() => updateStatus(task.id, "recommended")}
                      className="bg-white/5 border border-white/10 text-slate-400 text-xs font-bold px-3 py-2 rounded-lg hover:bg-white/10 transition-all">
                      ↩
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Finished */}
          {!tasksLoading && taskTab === "finished" && (
            <div className="space-y-3">
              <p className="text-slate-400 text-xs mb-3">Completed jobs — full history.</p>
              {finished.length === 0 && <div className="text-center py-12 text-slate-500 text-sm">No finished jobs yet. Keep pushing.</div>}
              {finished.map(task => (
                <div key={task.id} className="bg-white/5 border border-emerald-500/20 rounded-xl p-4 opacity-80">
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400 text-lg mt-0.5">✅</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm leading-snug line-through text-slate-400">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${CATEGORY_COLORS[task.category] || CATEGORY_COLORS["General"]}`}>{task.category}</span>
                        <span className="text-slate-500 text-xs">{task.assigned_to}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Brain Tab */}
      {tab === "brain" && (
        <div className="space-y-3">
          <p className="text-slate-400 text-xs mb-4">Felix's 24hr intel feed — all important info logged here automatically.</p>
          {brainLoading && <div className="text-center py-12 text-slate-500 text-sm">Loading...</div>}
          {!brainLoading && brain.length === 0 && <div className="text-center py-12 text-slate-500 text-sm">No entries yet.</div>}
          {!brainLoading && brain.map(entry => (
            <div key={entry.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-sm leading-snug flex-1">{entry.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold whitespace-nowrap flex-shrink-0 ${CATEGORY_COLORS[entry.category] || CATEGORY_COLORS["General"]}`}>{entry.category}</span>
              </div>
              <p className="text-slate-500 text-xs mb-2">{timeAgo(entry.created_at)}</p>
              <p className={`text-slate-300 text-sm leading-relaxed ${expanded === entry.id ? "" : "line-clamp-3"}`}>{entry.content}</p>
              {entry.content.length > 150 && (
                <button onClick={() => setExpanded(expanded === entry.id ? null : entry.id)} className="text-[#22C55E] text-xs mt-2 font-semibold">
                  {expanded === entry.id ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Products Tab */}
      {tab === "products" && (
        <div className="space-y-4">
          {PRODUCTS.map(p => (
            <div key={p.name} className="bg-white/5 border border-white/10 rounded-xl p-5">
              <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">{p.tag}</span>
              <h3 className="font-extrabold text-lg mt-2">{p.name}</h3>
              <p className="text-[#22C55E] font-bold text-sm mt-1">{p.price}</p>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">{p.description}</p>
              <div className="mt-4 space-y-2">
                {p.includes.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-[#22C55E] mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-lg p-3">
                <p className="text-xs text-slate-400"><span className="text-[#22C55E] font-bold">Guarantee:</span> {p.guarantee}</p>
              </div>
            </div>
          ))}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h3 className="font-extrabold text-base mb-4">Add-On Services</h3>
            <div className="space-y-3">
              {ADDONS.map(a => (
                <div key={a.name} className="flex items-start gap-3">
                  <span className="text-2xl">{a.icon}</span>
                  <div>
                    <p className="font-semibold text-sm">{a.name}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Team Tab */}
      {tab === "team" && (
        <div className="space-y-3">
          {TEAM.map(m => (
            <div key={m.name} className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/30 flex items-center justify-center font-extrabold text-[#22C55E]">{m.initial}</div>
                <div>
                  <p className="font-bold">{m.name}</p>
                  <p className="text-slate-400 text-xs">{m.role}</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm">{m.focus}</p>
            </div>
          ))}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-[#0A0F1E]/95 border-t border-white/10 px-4 py-3 text-center">
        <p className="text-slate-500 text-xs">⚡ Felix is watching. Brain updates every 24hrs.</p>
      </div>
    </div>
  );
}
