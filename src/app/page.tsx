"use client";
import { useState } from "react";

const TASKS = [
  { id: 1, title: "Deploy WFC retention site", priority: "high", status: "pending", category: "Tech", by: "Felix" },
  { id: 2, title: "Lock in brand name (RetainIQ vs WFC-branded)", priority: "high", status: "pending", category: "Brand", by: "Felix" },
  { id: 3, title: "Set up GHL agency account", priority: "high", status: "pending", category: "Operations", by: "Hans" },
  { id: 4, title: "Register domain for retention site", priority: "high", status: "pending", category: "Tech", by: "Hans" },
  { id: 5, title: "Build restaurant prospect list (200km from J0K 1S0)", priority: "medium", status: "pending", category: "Sales", by: "Felix" },
  { id: 6, title: "Set up email outreach infrastructure (domains + warm-up)", priority: "medium", status: "pending", category: "Sales", by: "Felix" },
  { id: 7, title: "Configure Twilio number for EternalLine AI agent", priority: "low", status: "pending", category: "EternalLine", by: "Hans" },
  { id: 8, title: "Create onboarding call script for new clients", priority: "medium", status: "pending", category: "Sales", by: "Felix" },
];

const PRODUCTS = [
  {
    name: "Customer Retention System",
    tag: "Core Product",
    color: "emerald",
    price: "$2,000 setup + $449/mo",
    description: "QR code → customer opts in → SMS database → automated follow-up",
    includes: [
      "Custom QR code + branded stickers shipped",
      "Client-owned customer database",
      "SMS campaign dashboard (5,000 SMS/mo)",
      "Automated review funnel (5★→Google, 1-3★→private)",
      "3-message welcome sequence",
      "60–90 min guided onboarding call",
    ],
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
  { name: "Hans", role: "CEO / Co-Founder", focus: "Sales, strategy, growth" },
  { name: "Lars", role: "CEO / Co-Founder", focus: "Sales, growth, client relations" },
  { name: "Felix", role: "AI Operating Partner", focus: "Operations, tech, execution, proactive growth" },
];

type Tab = "tasks" | "products" | "team" | "company";

export default function Home() {
  const [tab, setTab] = useState<Tab>("tasks");
  const [tasks, setTasks] = useState(TASKS);

  const approve = (id: number) => setTasks(t => t.map(x => x.id === id ? { ...x, status: "approved" } : x));
  const done = (id: number) => setTasks(t => t.map(x => x.id === id ? { ...x, status: "done" } : x));

  const priorityColor = (p: string) => p === "high" ? "text-red-400" : p === "medium" ? "text-yellow-400" : "text-slate-400";
  const statusBadge = (s: string) => {
    if (s === "approved") return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    if (s === "done") return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    return "bg-slate-500/20 text-slate-400 border-slate-500/30";
  };

  const pending = tasks.filter(t => t.status === "pending").length;
  const approved = tasks.filter(t => t.status === "approved").length;
  const done_ = tasks.filter(t => t.status === "done").length;

  return (
    <div className="max-w-lg mx-auto px-4 pb-24">
      {/* Header */}
      <div className="pt-12 pb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">⚡</span>
          <h1 className="text-2xl font-extrabold tracking-tight">WFC Mission Control</h1>
        </div>
        <p className="text-slate-400 text-sm ml-11">Felix is running. Everything tracked.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Pending", value: pending, color: "text-yellow-400" },
          { label: "Approved", value: approved, color: "text-blue-400" },
          { label: "Done", value: done_, color: "text-emerald-400" },
        ].map((s) => (
          <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-slate-500 text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-6 border border-white/10">
        {(["tasks", "products", "team", "company"] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${tab === t ? "bg-[#22C55E] text-white" : "text-slate-400 hover:text-white"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tasks Tab */}
      {tab === "tasks" && (
        <div className="space-y-3">
          <p className="text-slate-400 text-xs mb-4">Felix's proactive work queue — approve what to do first.</p>
          {tasks.map(task => (
            <div key={task.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <p className="font-semibold text-sm leading-snug">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-xs font-bold uppercase ${priorityColor(task.priority)}`}>{task.priority}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-xs text-slate-500">{task.category}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-xs text-slate-500">{task.by}</span>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border font-semibold whitespace-nowrap ${statusBadge(task.status)}`}>
                  {task.status}
                </span>
              </div>
              {task.status === "pending" && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => approve(task.id)} className="flex-1 bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-bold py-1.5 rounded-lg hover:bg-[#22C55E]/20 transition-all">
                    ✓ Approve
                  </button>
                  <button onClick={() => done(task.id)} className="flex-1 bg-white/5 border border-white/10 text-slate-400 text-xs font-bold py-1.5 rounded-lg hover:bg-white/10 transition-all">
                    Mark Done
                  </button>
                </div>
              )}
              {task.status === "approved" && (
                <button onClick={() => done(task.id)} className="w-full mt-3 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold py-1.5 rounded-lg hover:bg-blue-500/20 transition-all">
                  Mark Done
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
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">{p.tag}</span>
              </div>
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
                <div className="w-10 h-10 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/30 flex items-center justify-center font-extrabold text-[#22C55E]">
                  {m.name[0]}
                </div>
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

      {/* Company Tab */}
      {tab === "company" && (
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h3 className="font-extrabold text-lg mb-3">WFC Solution</h3>
            <div className="space-y-3 text-sm">
              {[
                { label: "Mission", value: "Turn local business foot traffic into a permanent customer database and keep them coming back on autopilot." },
                { label: "Market", value: "Local businesses — restaurants, spas, salons, retail. Quebec-first, scalable." },
                { label: "Language", value: "Bilingual FR/EN" },
                { label: "Backend CRM", value: "GoHighLevel (agency sub-accounts)" },
                { label: "Pricing model", value: "One-time setup + monthly recurring" },
                { label: "Spring Blitz", value: "Setup at $2,000 until June 1. Goes to $3,500 after." },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-slate-500 text-xs uppercase tracking-wider">{item.label}</p>
                  <p className="text-slate-200 mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h3 className="font-bold mb-3">Open Blockers</h3>
            <div className="space-y-2">
              {[
                "Brand name decision (RetainIQ vs WFC-branded)",
                "GHL agency account setup",
                "Domain registration for retention site",
                "Twilio number for EternalLine agent",
              ].map((b, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-yellow-400 mt-0.5">⚠</span>
                  <span className="text-slate-300">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0A0F1E]/95 border-t border-white/10 px-4 py-3 text-center">
        <p className="text-slate-500 text-xs">⚡ Felix is watching. Updates sync on next heartbeat.</p>
      </div>
    </div>
  );
}
