"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import {
  Video,
  MonitorPlay,
  MessageSquare,
  ClipboardCheck,
  FileDown,
  CreditCard,
  UserCheck,
  Wallet,
  ArrowLeftRight,
  CalendarDays,
  LayoutDashboard,
} from "lucide-react";

const features = [
  {
    id: "01",
    title: "Live Lecture System",
    description:
      "Real-time WebRTC video lectures with screen sharing and live chat built in.",
    icon: Video,
    accent: "#6366f1",
    lightBg: "#eef2ff",
    iconBg: "bg-indigo-500",
    border: "border-indigo-100",
    tag: "WebRTC powered",
    tagColor: "bg-indigo-100 text-indigo-600",
    bullets: [
      { icon: MonitorPlay, label: "Screen sharing" },
      { icon: MessageSquare, label: "Real-time chat" },
    ],
    mockup: (
      <div className="w-full rounded-xl bg-white border border-indigo-100 shadow-sm overflow-hidden">
        {/* Fake video call UI */}
        <div className="bg-slate-900 p-3 relative">
          <div className="aspect-video rounded-lg bg-slate-800 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-indigo-900/40 to-slate-900/80" />
            <div className="w-10 h-10 rounded-full bg-indigo-500/30 flex items-center justify-center z-10">
              <span className="text-white text-sm font-bold">AR</span>
            </div>
            {/* Live badge */}
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500 px-2 py-0.5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[9px] text-white font-bold">LIVE</span>
            </div>
            {/* Participants */}
            <div className="absolute bottom-2 right-2 flex -space-x-1">
              {["PM", "RD", "SK"].map((a) => (
                <div
                  key={a}
                  className="w-5 h-5 rounded-full bg-indigo-400 border border-slate-800 flex items-center justify-center text-[8px] text-white font-bold"
                >
                  {a}
                </div>
              ))}
              <div className="w-5 h-5 rounded-full bg-slate-600 border border-slate-800 flex items-center justify-center text-[8px] text-white font-bold">
                +4
              </div>
            </div>
          </div>
        </div>
        <div className="p-2.5 flex items-center gap-2 border-t border-slate-100">
          <div className="flex-1 bg-slate-50 rounded-lg px-2.5 py-1.5">
            <p className="text-[10px] text-slate-400">Type a message…</p>
          </div>
          <div className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center">
            <MessageSquare className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "02",
    title: "Attendance Tracking",
    description:
      "Automatic attendance calculation per session with exportable reports.",
    icon: ClipboardCheck,
    accent: "#8b5cf6",
    lightBg: "#f5f3ff",
    iconBg: "bg-violet-500",
    border: "border-violet-100",
    tag: "Auto-calculated",
    tagColor: "bg-violet-100 text-violet-600",
    bullets: [
      { icon: ClipboardCheck, label: "Auto calculation" },
      { icon: FileDown, label: "Exportable reports" },
    ],
    mockup: (
      <div className="w-full rounded-xl bg-white border border-violet-100 shadow-sm p-3 space-y-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold text-slate-600">
            Batch A — Week 3
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-500 font-semibold">
            87% avg
          </span>
        </div>
        {[
          { name: "Arjun M.", pct: 92, color: "bg-violet-400" },
          { name: "Priya N.", pct: 78, color: "bg-violet-300" },
          { name: "Rohan D.", pct: 95, color: "bg-violet-500" },
          { name: "Sneha K.", pct: 65, color: "bg-amber-400" },
        ].map((s) => (
          <div key={s.name}>
            <div className="flex justify-between mb-0.5">
              <span className="text-[10px] text-slate-600 font-medium">
                {s.name}
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                {s.pct}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${s.color}`}
                style={{ width: `${s.pct}%` }}
              />
            </div>
          </div>
        ))}
        <div className="pt-1.5 flex justify-end">
          <div className="flex items-center gap-1 text-[10px] text-violet-500 font-semibold cursor-pointer">
            <FileDown className="w-3 h-3" /> Export CSV
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "03",
    title: "Secure Payments",
    description:
      "Razorpay-powered fee collection with automatic enrollment on payment.",
    icon: CreditCard,
    accent: "#3b82f6",
    lightBg: "#eff6ff",
    iconBg: "bg-blue-500",
    border: "border-blue-100",
    tag: "Razorpay integrated",
    tagColor: "bg-blue-100 text-blue-600",
    bullets: [
      { icon: CreditCard, label: "Razorpay integration" },
      { icon: UserCheck, label: "Auto enrollment" },
    ],
    mockup: (
      <div className="w-full rounded-xl bg-white border border-blue-100 shadow-sm p-3 space-y-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold text-slate-600">
            Recent Payments
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-500 font-semibold">
            ₹18,500 today
          </span>
        </div>
        {[
          { name: "Arjun M.", amount: "₹2,500", time: "2m ago", ok: true },
          { name: "Priya N.", amount: "₹2,500", time: "14m ago", ok: true },
          { name: "Rohan D.", amount: "₹2,500", time: "1h ago", ok: true },
          { name: "Sneha K.", amount: "₹2,500", time: "pending", ok: false },
        ].map((p) => (
          <div key={p.name} className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-700">
                {p.name}
              </p>
              <p className="text-[9px] text-slate-400">{p.time}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-700">
                {p.amount}
              </span>
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center ${p.ok ? "bg-green-100" : "bg-amber-100"}`}
              >
                <span
                  className={`text-[8px] font-bold ${p.ok ? "text-green-600" : "text-amber-500"}`}
                >
                  {p.ok ? "✓" : "…"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "04",
    title: "Teacher Wallet",
    description:
      "Track earnings, request payouts, and view full transaction history.",
    icon: Wallet,
    accent: "#06b6d4",
    lightBg: "#ecfeff",
    iconBg: "bg-cyan-500",
    border: "border-cyan-100",
    tag: "Instant payouts",
    tagColor: "bg-cyan-100 text-cyan-600",
    bullets: [
      { icon: Wallet, label: "Payouts" },
      { icon: ArrowLeftRight, label: "Transaction history" },
    ],
    mockup: (
      <div className="w-full rounded-xl bg-white border border-cyan-100 shadow-sm p-3 space-y-2">
        <div className="rounded-lg bg-linear-to-r from-cyan-500 to-blue-500 p-3 mb-2">
          <p className="text-[10px] text-cyan-100 font-medium">
            Available Balance
          </p>
          <p className="text-xl font-bold text-white">₹24,800</p>
          <div className="mt-1.5 flex justify-end">
            <div className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold cursor-pointer">
              Withdraw →
            </div>
          </div>
        </div>
        {[
          { label: "Batch A Fee", amount: "+₹2,500", type: "credit" },
          { label: "Batch B Fee", amount: "+₹3,000", type: "credit" },
          { label: "Payout", amount: "-₹5,000", type: "debit" },
        ].map((t) => (
          <div key={t.label} className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500">{t.label}</span>
            <span
              className={`text-[11px] font-bold ${t.type === "credit" ? "text-green-500" : "text-slate-500"}`}
            >
              {t.amount}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "05",
    title: "Course Management",
    description:
      "Schedule lectures, manage batches, and give students a clear dashboard.",
    icon: CalendarDays,
    accent: "#f59e0b",
    lightBg: "#fffbeb",
    iconBg: "bg-amber-500",
    border: "border-amber-100",
    tag: "Full control",
    tagColor: "bg-amber-100 text-amber-600",
    bullets: [
      { icon: CalendarDays, label: "Lecture scheduling" },
      { icon: LayoutDashboard, label: "Student dashboards" },
    ],
    mockup: (
      <div className="w-full rounded-xl bg-white border border-amber-100 shadow-sm p-3 space-y-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold text-slate-600">
            This Week
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-500 font-semibold">
            4 classes
          </span>
        </div>
        {[
          {
            day: "Mon",
            title: "React Fundamentals",
            time: "6:00 PM",
            live: true,
          },
          {
            day: "Wed",
            title: "State Management",
            time: "6:00 PM",
            live: false,
          },
          {
            day: "Fri",
            title: "API Integration",
            time: "6:00 PM",
            live: false,
          },
          {
            day: "Sat",
            title: "Project Review",
            time: "11:00 AM",
            live: false,
          },
        ].map((c) => (
          <div key={c.title} className="flex items-center gap-2.5">
            <div className="w-8 shrink-0 text-center">
              <p className="text-[9px] font-bold text-amber-500 uppercase">
                {c.day}
              </p>
            </div>
            <div className="flex-1 flex items-center justify-between">
              <span className="text-[11px] text-slate-700 font-medium">
                {c.title}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-slate-400">{c.time}</span>
                {c.live && (
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

const SmallCard = ({
  icon: Icon,
  title,
  description,
  accent,
  lightBg,
  iconBg,
  border,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  accent: string;
  lightBg: string;
  iconBg: string;
  border: string;
}) => (
  <div
    className={`rounded-2xl border ${border} p-5 flex flex-col gap-3 h-full`}
    style={{ backgroundColor: lightBg }}
  >
   
    <div>
      <p className="text-slate-900 font-bold text-sm mb-1">{title}</p>
      <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
    </div>
  </div>
);

const CenterMockup = () => (
  <div className="relative flex items-center justify-center">
    {/* Phone frame */}
    <div className="relative w-56 h-110 sm:w-70 bg-white  rounded-2xl border-2 border-slate-200 shadow-2xl overflow-hidden">
      {/* Status bar */}
      <div className="bg-slate-50 px-5 py-2 flex items-center justify-between border-b border-slate-100">
        <span className="text-[10px] font-bold text-slate-600">9:41</span>
        <div className="flex items-center gap-1">
          <div className="w-3 h-2 border border-slate-400 rounded-sm relative">
            <div className="absolute inset-y-0.5 left-0.5 right-1 bg-slate-600 rounded-sm" />
          </div>
        </div>
      </div>

      {/* App content */}
      <div className="p-4 bg-white space-y-3">
        <div>
          <p className="text-[10px] text-slate-400 font-medium">
            Welcome back 👋
          </p>
          <p className="text-sm font-bold text-slate-900">Rahul's Dashboard</p>
        </div>

        {/* Live now card */}
        <div className="rounded-xl bg-indigo-500 p-3">
          <div className="flex items-center gap-1 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[9px] text-indigo-200 font-bold uppercase">
              Live Now
            </span>
          </div>
          <p className="text-white text-xs font-semibold">React Fundamentals</p>
          <p className="text-indigo-200 text-[10px]">47 students joined</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-violet-50 p-2 border border-violet-100">
            <p className="text-[9px] text-violet-400 font-medium">Attendance</p>
            <p className="text-sm font-bold text-violet-600">92%</p>
          </div>
          <div className="rounded-lg bg-cyan-50 p-2 border border-cyan-100">
            <p className="text-[9px] text-cyan-400 font-medium">Balance</p>
            <p className="text-sm font-bold text-cyan-600">₹24.8k</p>
          </div>
        </div>

        {/* Next class */}
        <div className="rounded-xl bg-amber-50 border border-amber-100 p-2.5 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">
            <CalendarDays className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-700">
              State Management
            </p>
            <p className="text-[9px] text-slate-400">Wed · 6:00 PM</p>
          </div>
        </div>

        {/* Payments row */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
            Recent
          </p>
          {[
            { name: "Arjun M.", amt: "+₹2,500", color: "text-green-500" },
            { name: "Priya N.", amt: "+₹2,500", color: "text-green-500" },
          ].map((p) => (
            <div key={p.name} className="flex justify-between items-center">
              <span className="text-[10px] text-slate-600">{p.name}</span>
              <span className={`text-[10px] font-bold ${p.color}`}>
                {p.amt}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Floating badge */}
    <div className="absolute -top-3 -right-3 w-12 h-12 rounded-2xl bg-slate-900 shadow-xl flex items-center justify-center rotate-6">
      <span className="text-white text-lg">✓</span>
    </div>
    <div className="absolute -bottom-2 -left-4 w-10 h-10 rounded-xl bg-indigo-500 shadow-lg flex items-center justify-center -rotate-6">
      <Video className="w-4 h-4 text-white" />
    </div>
  </div>
);

const Features = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const phoneY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-white py-24 sm:py-32 overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />

      <div className="relative z-10 container mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            className="text-xs font-bold tracking-[0.2em] uppercase text-slate-400 mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Everything you need
          </motion.p>
          <motion.h2
            className="text-4xl sm:text-5xl font-bold tracking-[-0.03em] leading-tight"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
          >
            <span className="text-slate-900">Powerful features</span>
            <br />
            <span className="text-slate-300">at your fingertips.</span>
          </motion.h2>
          <motion.p
            className="mt-4 text-slate-400 text-base max-w-md mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 }}
          >
            One platform to run your entire online teaching operation — from
            live class to final payout.
          </motion.p>
        </div>

        {/* Layout: 2 left cards | center phone | 2 right cards */}
        <motion.div
          className="flex flex-col lg:flex-row items-center "
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {/* Left col: 2 cards */}
          <div className="flex flex-row lg:flex-col gap-4 w-full lg:w-56 shrink-0">
            {[features[0], features[1]].map((f) => (
              <motion.div
                key={f.id}
                className="flex-1 lg:flex-none"
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.45 } },
                }}
              >
                <SmallCard
                  icon={f.icon}
                  title={f.title}
                  description={f.description}
                  accent={f.accent}
                  lightBg={f.lightBg}
                  iconBg={f.iconBg}
                  border={f.border}
                />
              </motion.div>
            ))}
          </div>

          {/* Center phone mockup */}
          <motion.div
            className="flex-1 flex items-center justify-center lg:py-0"
            style={{ y: phoneY }}
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
            }}
          >
            <CenterMockup />
          </motion.div>

          {/* Right col: 2 cards */}
          <div className="flex flex-row lg:flex-col gap-4 w-full lg:w-56 shrink-0">
            {[features[2], features[3]].map((f) => (
              <motion.div
                key={f.id}
                className="flex-1 lg:flex-none"
                variants={{
                  hidden: { opacity: 0, x: 20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.45 } },
                }}
              >
                <SmallCard
                  icon={f.icon}
                  title={f.title}
                  description={f.description}
                  accent={f.accent}
                  lightBg={f.lightBg}
                  iconBg={f.iconBg}
                  border={f.border}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 5th card centered below */}
        <motion.div
          className="mt-6 max-w-xs mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.2 }}
        >
          <SmallCard
            icon={features[4].icon}
            title={features[4].title}
            description={features[4].description}
            accent={features[4].accent}
            lightBg={features[4].lightBg}
            iconBg={features[4].iconBg}
            border={features[4].border}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
