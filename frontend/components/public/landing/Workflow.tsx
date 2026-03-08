"use client";

import React, { useRef } from "react";
import { motion } from "motion/react";
import {
  BookOpen,
  Users,
  Video,
  ClipboardCheck,
  Wallet,
  ArrowDown,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: BookOpen,
    title: "Create a Course",
    description:
      "Set up your batch, define the schedule, and publish it live in minutes.",
    accent: "#6366f1",
    lightBg: "#eef2ff",
    iconBg: "bg-indigo-500",
    border: "border-indigo-100",
    tagColor: "bg-indigo-100 text-indigo-600",
    mockup: (
      <div className="space-y-2">
        <div className="rounded-lg bg-white border border-indigo-100 p-3 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              New Course
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-50 text-green-500 font-semibold">
              Draft
            </span>
          </div>
          <div className="h-5 w-3/4 rounded bg-indigo-50 border border-indigo-100 mb-1.5 flex items-center px-2">
            <span className="text-[10px] text-indigo-400">
              React Masterclass 2025
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="h-4 rounded bg-slate-50 border border-slate-100 flex items-center px-2">
              <span className="text-[9px] text-slate-400">₹2,500/month</span>
            </div>
            <div className="h-4 rounded bg-slate-50 border border-slate-100 flex items-center px-2">
              <span className="text-[9px] text-slate-400">Mon/Wed/Fri</span>
            </div>
          </div>
        </div>
        <div className="flex gap-1.5">
          <div className="flex-1 rounded-lg bg-indigo-500 py-1.5 flex items-center justify-center">
            <span className="text-[10px] text-white font-bold">
              Publish Course →
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: "02",
    icon: Users,
    title: "Students Enroll & Pay",
    description:
      "Students discover your course, pay via Razorpay, and get instant access.",
    accent: "#8b5cf6",
    lightBg: "#f5f3ff",
    iconBg: "bg-violet-500",
    border: "border-violet-100",
    tagColor: "bg-violet-100 text-violet-600",
    mockup: (
      <div className="space-y-2">
        <div className="rounded-lg bg-white border border-violet-100 p-3 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500">
              Enrollments today
            </span>
            <span className="text-[10px] font-bold text-violet-500">
              +7 new
            </span>
          </div>
          {[
            { name: "Arjun M.", time: "2m ago", paid: true },
            { name: "Priya N.", time: "8m ago", paid: true },
            { name: "Rohan D.", time: "23m ago", paid: true },
          ].map((s) => (
            <div key={s.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center text-[8px] font-bold text-violet-500">
                  {s.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <span className="text-[10px] text-slate-600 font-medium">
                  {s.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-slate-400">{s.time}</span>
                <CheckCircle2 className="w-3 h-3 text-green-500" />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-violet-50 border border-violet-100 px-3 py-2 flex items-center justify-between">
          <span className="text-[10px] text-violet-600 font-semibold">
            Total collected
          </span>
          <span className="text-[11px] text-violet-700 font-bold">₹17,500</span>
        </div>
      </div>
    ),
  },
  {
    number: "03",
    icon: Video,
    title: "Conduct Live Lectures",
    description:
      "Start your class with one click — WebRTC video, screen share, and chat ready.",
    accent: "#3b82f6",
    lightBg: "#eff6ff",
    iconBg: "bg-blue-500",
    border: "border-blue-100",
    tagColor: "bg-blue-100 text-blue-600",
    mockup: (
      <div className="space-y-2">
        <div className="rounded-lg bg-slate-900 overflow-hidden shadow-sm">
          <div className="relative aspect-video flex items-center justify-center bg-linear-to-br from-blue-900/60 to-slate-900">
            <div className="w-8 h-8 rounded-full bg-blue-500/40 flex items-center justify-center">
              <span className="text-white text-xs font-bold">RK</span>
            </div>
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500 px-1.5 py-0.5 rounded-full">
              <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
              <span className="text-[8px] text-white font-bold">LIVE</span>
            </div>
            <div className="absolute bottom-2 right-2 flex -space-x-1">
              {["AM", "PN", "RD"].map((a) => (
                <div
                  key={a}
                  className="w-4 h-4 rounded-full bg-blue-400 border border-slate-800 flex items-center justify-center text-[7px] text-white font-bold"
                >
                  {a}
                </div>
              ))}
              <div className="w-4 h-4 rounded-full bg-slate-600 border border-slate-800 flex items-center justify-center text-[7px] text-white">
                +5
              </div>
            </div>
          </div>
          <div className="px-2.5 py-1.5 flex items-center justify-between">
            <span className="text-[9px] text-slate-400">
              React Masterclass · Session 4
            </span>
            <div className="flex gap-1">
              {["🎤", "📺", "💬"].map((e) => (
                <div
                  key={e}
                  className="w-4 h-4 rounded bg-slate-700 flex items-center justify-center text-[8px]"
                >
                  {e}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: "04",
    icon: ClipboardCheck,
    title: "Attendance Auto-Tracked",
    description:
      "Every join and leave is logged. Reports are ready to export anytime.",
    accent: "#06b6d4",
    lightBg: "#ecfeff",
    iconBg: "bg-cyan-500",
    border: "border-cyan-100",
    tagColor: "bg-cyan-100 text-cyan-600",
    mockup: (
      <div className="space-y-2">
        <div className="rounded-lg bg-white border border-cyan-100 p-3 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500">
              Session 4 — Attendance
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-500 font-semibold">
              Auto ✓
            </span>
          </div>
          {[
            { name: "Arjun M.", pct: 94 },
            { name: "Priya N.", pct: 81 },
            { name: "Rohan D.", pct: 100 },
            { name: "Sneha K.", pct: 67 },
          ].map((s) => (
            <div key={s.name}>
              <div className="flex justify-between mb-0.5">
                <span className="text-[10px] text-slate-600">{s.name}</span>
                <span
                  className="text-[10px] font-bold"
                  style={{ color: s.pct >= 85 ? "#06b6d4" : "#f59e0b" }}
                >
                  {s.pct}%
                </span>
              </div>
              <div className="h-1 rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${s.pct}%`,
                    backgroundColor: s.pct >= 85 ? "#06b6d4" : "#f59e0b",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    number: "05",
    icon: Wallet,
    title: "Teachers Get Paid",
    description:
      "Earnings are calculated automatically. Request payouts directly to your bank.",
    accent: "#f59e0b",
    lightBg: "#fffbeb",
    iconBg: "bg-amber-500",
    border: "border-amber-100",
    tagColor: "bg-amber-100 text-amber-600",
    mockup: (
      <div className="space-y-2">
        <div className="rounded-lg bg-linear-to-r from-amber-400 to-orange-400 p-3 shadow-sm">
          <p className="text-[9px] text-amber-100 font-medium">Your Wallet</p>
          <p className="text-lg font-bold text-white">₹24,800</p>
          <div className="mt-1 flex justify-end">
            <div className="text-[9px] bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold">
              Withdraw →
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white border border-amber-100 p-2.5 shadow-sm space-y-1.5">
          {[
            {
              label: "Batch A · 7 students",
              amt: "+₹17,500",
              color: "text-green-500",
            },
            {
              label: "Batch B · 4 students",
              amt: "+₹10,000",
              color: "text-green-500",
            },
            {
              label: "Payout to HDFC",
              amt: "-₹20,000",
              color: "text-slate-400",
            },
          ].map((t) => (
            <div key={t.label} className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500">{t.label}</span>
              <span className={`text-[10px] font-bold ${t.color}`}>
                {t.amt}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

const Workflow = () => {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-white py-24 sm:py-32 overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />

      <div className="relative z-10 container mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            className="text-xs font-bold tracking-[0.2em] uppercase text-slate-400 mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            How it works
          </motion.p>
          <motion.h2
            className="text-4xl sm:text-5xl font-bold tracking-[-0.03em] leading-tight"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
          >
            <span className="text-slate-900">From zero to payout</span>
            <br />
            <span className="text-slate-300">in five steps.</span>
          </motion.h2>
          <motion.p
            className="mt-4 text-slate-400 text-base max-w-md mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 }}
          >
            Everything flows together — no switching tabs, no manual work.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical connector line */}
          <div
            className="absolute left-6 top-8 bottom-8 w-px bg-linear-to-b from-indigo-200  via-cyan-200 to-amber-200 hidden sm:block"
            style={{ left: "calc(50% - 0.5px)" }}
          />

          <div className="space-y-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isEven = i % 2 === 0;

              return (
                <motion.div
                  key={step.number}
                  className="relative flex flex-col sm:flex-row items-center gap-6"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.08,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {/* Left side — text on even, mockup on odd */}
                  <div
                    className={`flex-1 w-full ${isEven ? "sm:text-right" : "sm:order-3"}`}
                  >
                    {isEven ? (
                      <div className="sm:flex sm:flex-col sm:items-end">
                        <div
                          className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold mb-3 ${step.tagColor}`}
                        >
                          <Icon className="w-3 h-3" />
                          Step {step.number}
                        </div>
                        <h3 className="text-slate-900 font-bold text-xl tracking-tight mb-2">
                          {step.title}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                          {step.description}
                        </p>
                      </div>
                    ) : (
                      <div
                        className="rounded-2xl border overflow-hidden p-4"
                        style={{
                          backgroundColor: step.lightBg,
                          borderColor: step.accent + "33",
                        }}
                      >
                        {step.mockup}
                      </div>
                    )}
                  </div>

                  {/* Center node */}
                  <div className="relative z-10 shrink-0 sm:order-2">
                    <div
                      className={`w-12 h-12 rounded-2xl ${step.iconBg} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Right side — mockup on even, text on odd */}
                  <div
                    className={`flex-1 w-full ${isEven ? "sm:order-3" : ""}`}
                  >
                    {isEven ? (
                      <div
                        className="rounded-2xl border overflow-hidden p-4"
                        style={{
                          backgroundColor: step.lightBg,
                          borderColor: step.accent + "33",
                        }}
                      >
                        {step.mockup}
                      </div>
                    ) : (
                      <div>
                        <div
                          className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold mb-3 ${step.tagColor}`}
                        >
                          <Icon className="w-3 h-3" />
                          Step {step.number}
                        </div>
                        <h3 className="text-slate-900 font-bold text-xl tracking-tight mb-2">
                          {step.title}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                          {step.description}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-slate-400 text-sm mb-4">
            <span className="text-slate-700 font-semibold">
              Ready to start?
            </span>{" "}
            Set up your first course in under 5 minutes.
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-600 transition-colors shadow-sm shadow-indigo-200">
            Get Started Free
            <ArrowDown className="w-4 h-4 rotate-90" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Workflow;
