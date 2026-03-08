"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ClipboardX, Video, CreditCard, LayoutDashboard } from "lucide-react";

const randomWidths = [42, 55, 38, 60, 47];

const problems = [
  {
    number: "01",
    icon: ClipboardX,
    title: "Manual Attendance",
    description: "Roll calls. Spreadsheets. Guesswork. Every single session.",
    accent: "#6366f1",
    bg: "#eef2ff",
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-500",
    border: "border-indigo-100",
    tag: "~40 min lost/session",
    tagColor: "bg-indigo-100 text-indigo-600",
    mockup: (
      <div className="w-full rounded-xl bg-white border border-indigo-100 shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-slate-500">
            Today's Session
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-400 font-medium">
            Not tracked
          </span>
        </div>
        {[
          { name: "Arjun Mehta", status: "present", avatar: "AM" },
          { name: "Priya Nair", status: "absent", avatar: "PN" },
          { name: "Rohan Das", status: "present", avatar: "RD" },
          { name: "Sneha K.", status: "unknown", avatar: "SK" },
        ].map((s) => (
          <div key={s.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-500">
                {s.avatar}
              </div>
              <span className="text-xs text-slate-600 font-medium">
                {s.name}
              </span>
            </div>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                s.status === "present"
                  ? "bg-green-50 text-green-500"
                  : s.status === "absent"
                    ? "bg-red-50 text-red-400"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              {s.status === "unknown" ? "?" : s.status}
            </span>
          </div>
        ))}
        <div className="pt-1 border-t border-slate-100 flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span className="text-[10px] text-slate-400">
            Manually updated — 2 entries missing
          </span>
        </div>
      </div>
    ),
  },
  {
    number: "02",
    icon: Video,
    title: "Chaotic Live Classes",
    description:
      "Links, access, late joiners — pure chaos before you even start.",
    accent: "#8b5cf6",
    bg: "#f5f3ff",
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500",
    border: "border-violet-100",
    tag: "3–5 tools juggled",
    tagColor: "bg-violet-100 text-violet-600",
    mockup: (
      <div className="w-full rounded-xl bg-white border border-violet-100 shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-slate-500">
            Class Links
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-500 font-medium">
            Scattered
          </span>
        </div>
        {[
          {
            tool: "Zoom",
            label: "zoom.us/j/94810…",
            color: "bg-blue-50 text-blue-500",
          },
          {
            tool: "Google Meet",
            label: "meet.google.com/abc…",
            color: "bg-green-50 text-green-500",
          },
          {
            tool: "WhatsApp",
            label: "Shared in group chat",
            color: "bg-emerald-50 text-emerald-500",
          },
          {
            tool: "Email",
            label: "Sent 3 days ago",
            color: "bg-slate-50 text-slate-400",
          },
        ].map((item) => (
          <div key={item.tool} className="flex items-center gap-3">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${item.color}`}
            >
              {item.tool}
            </span>
            <span className="text-[11px] text-slate-400 truncate">
              {item.label}
            </span>
          </div>
        ))}
        <div className="pt-1 border-t border-slate-100 flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[10px] text-slate-400">
            Students don't know which link to use
          </span>
        </div>
      </div>
    ),
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Payment Complexity",
    description:
      "Chasing fees and reconciling payments eats your teaching time.",
    accent: "#3b82f6",
    bg: "#eff6ff",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500",
    border: "border-blue-100",
    tag: "Hours/week on admin",
    tagColor: "bg-blue-100 text-blue-600",
    mockup: (
      <div className="w-full rounded-xl bg-white border border-blue-100 shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-slate-500">
            Fee Collection
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-400 font-medium">
            3 pending
          </span>
        </div>
        {[
          { name: "Arjun Mehta", amount: "₹2,500", status: "paid" },
          { name: "Priya Nair", amount: "₹2,500", status: "pending" },
          { name: "Rohan Das", amount: "₹2,500", status: "overdue" },
          { name: "Sneha K.", amount: "₹2,500", status: "paid" },
        ].map((p) => (
          <div key={p.name} className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">{p.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">
                {p.amount}
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  p.status === "paid"
                    ? "bg-green-50 text-green-500"
                    : p.status === "pending"
                      ? "bg-amber-50 text-amber-500"
                      : "bg-red-50 text-red-500"
                }`}
              >
                {p.status}
              </span>
            </div>
          </div>
        ))}
        <div className="pt-1 border-t border-slate-100 flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
          <span className="text-[10px] text-slate-400">
            Manually tracked in spreadsheet
          </span>
        </div>
      </div>
    ),
  },
  {
    number: "04",
    icon: LayoutDashboard,
    title: "No Single Source of Truth",
    description: "Data scattered everywhere. Nothing talks. No full picture.",
    accent: "#06b6d4",
    bg: "#ecfeff",
    iconColor: "text-cyan-500",
    iconBg: "bg-cyan-500",
    border: "border-cyan-100",
    tag: "Zero program visibility",
    tagColor: "bg-cyan-100 text-cyan-600",
    mockup: (
      <div className="w-full rounded-xl bg-white border border-cyan-100 shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-slate-500">
            Your data lives in…
          </span>
        </div>
        {[
          { app: "Google Sheets", data: "Attendance", icon: "📊" },
          { app: "Razorpay", data: "Payments", icon: "💳" },
          { app: "Google Drive", data: "Recordings", icon: "🎥" },
          { app: "WhatsApp", data: "Student queries", icon: "💬" },
          { app: "Gmail", data: "Schedules", icon: "📧" },
        ].map((item,i) => (
          <div key={item.app} className="flex items-center gap-3">
            <span className="text-sm">{item.icon}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-600">
                  {item.app}
                </span>
                <span className="text-[10px] text-slate-400">{item.data}</span>
              </div>
              <div className="mt-1 h-1 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-cyan-200"
                  style={{ width: `${randomWidths[i]}%` }}
                />
              </div>
            </div>
          </div>
        ))}
        <div className="pt-1 border-t border-slate-100 flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] text-slate-400">
            No unified view exists
          </span>
        </div>
      </div>
    ),
  },
];

const ProblemCard = ({
  problem,
  index,
}: {
  problem: (typeof problems)[0];
  index: number;
}) => {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end center"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);

  return (
    <motion.div
      ref={cardRef}
      style={{ y, opacity, scale, zIndex: index + 1 }}
      className="w-full"
    >
      <div
        className="relative rounded-2xl border overflow-hidden"
        style={{ backgroundColor: problem.bg }}
      >
        <div className="p-5">
          <div className="flex flex-col gap-4">
            {/* Text content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-slate-900 font-bold text-base tracking-tight mb-1.5">
                {problem.title}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-3">
                {problem.description}
              </p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${problem.tagColor}`}
              >
                {problem.tag}
              </span>
            </div>

            {/* Mockup */}
            <div className="w-full">{problem.mockup}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Problem = () => {
  return (
    <section className="relative w-full bg-white py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="relative z-10 container mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.h2
            className="text-4xl sm:text-5xl font-bold tracking-[-0.03em] leading-tight"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <span className="text-slate-900">Your tools are </span>
            <span className="text-slate-300">
              working <br /> against you.
            </span>
          </motion.h2>

          <motion.p
            className="mt-4 text-slate-400 text-base max-w-md mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Online educators spend more time managing tools than teaching
            students.
          </motion.p>
        </div>

        {/* Cards — 1 col mobile, 2 col md, 4 col lg */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {problems.map((problem, i) => (
            <ProblemCard key={problem.number} problem={problem} index={i} />
          ))}
        </div>

        <motion.div
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-slate-400 text-sm">
            <span className="text-slate-700 font-semibold">
              Sound familiar?
            </span>{" "}
            There's a better way to run your classroom.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Problem;
