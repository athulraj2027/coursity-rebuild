import React from "react";
import Link from "next/link";
import { ArrowRight, Play, Zap, Shield, Users } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative w-full min-h-[calc(100vh-4rem)] flex items-center overflow-hidden bg-slate-950">
      {/* ── Background grid ── */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Color blobs ── */}
      <div className="absolute top-[-10%] right-[-5%] w-120 h-120 rounded-full bg-indigo-600 opacity-20 blur-[100px]" />
      <div className="absolute bottom-[-5%] left-[-5%] w-100 h-100 rounded-full bg-blue-500 opacity-15 blur-[100px]" />
      <div className="absolute top-[40%] left-[40%] w-75 h-75 rounded-full bg-violet-600 opacity-10 blur-[80px]" />

      <div className="relative z-10 container mx-auto max-w-5xl px-6 py-24 sm:py-32">
        {/* ── Eyebrow ── */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wider uppercase">
            <Zap className="w-3 h-3 fill-indigo-400 text-indigo-400" />
            Real-time learning platform
          </div>
        </div>

        {/* ── Headline ── */}
        <h1 className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]">
          <span className="text-white">Live Classes.</span>
          <br />
          <span className="text-white">Real Attendance.</span>
          <br />
          <span
            className="inline-block"
            style={{
              background:
                "linear-gradient(135deg, #818cf8 0%, #60a5fa 50%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Zero Guesswork.
          </span>
        </h1>

        {/* ── Sub ── */}
        <p className="mt-7 text-center text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium">
          A structured online teaching platform with real-time video, role-based
          access, and automatic attendance — built for educators who care about{" "}
          <span className="text-slate-200 font-semibold">accountability</span>,
          not vanity metrics.
        </p>

        {/* ── CTAs ── */}
        <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
          <Link href="/sign-up">
            <button className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white text-sm font-bold tracking-wide transition-all duration-200 hover:-translate-y-0.5">
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>
          </Link>

          <button className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white text-sm font-bold tracking-wide transition-all duration-200 hover:-translate-y-0.5">
            <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <Play className="w-2.5 h-2.5 text-white fill-white ml-0.5" />
            </div>
            Watch Demo
          </button>
        </div>

        {/* ── Trust badges ── */}
        <div className="mt-14 flex items-center justify-center gap-6 flex-wrap">
          {[
            {
              icon: Shield,
              label: "Role-based access",
              color: "text-emerald-400",
            },
            { icon: Users, label: "Real-time video", color: "text-blue-400" },
            { icon: Zap, label: "Auto attendance", color: "text-amber-400" },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${color}`} strokeWidth={1.8} />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
