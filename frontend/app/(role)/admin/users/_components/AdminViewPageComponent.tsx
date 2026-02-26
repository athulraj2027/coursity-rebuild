"use client";
import { useUserByIdQuery } from "@/queries/admin/users.queries";
import React from "react";
import {
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Wallet,
  Mail,
  Calendar,
  CreditCard,
  Users,
  BarChart2,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import Loading from "@/components/common/Loading";
import Error from "@/components/common/Error";

/* ─── Types ───────────────────────────────────────────────────────────────── */
type Role = "STUDENT" | "TEACHER" | "ADMIN";

interface UserDetail {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  wallet: {
    id: string;
    balance: number;
    _count: { transactions: number };
  } | null;
  stats: {
    totalCourses: number;
    totalEnrollments: number;
    totalPayments: number;
    totalWalletTransactions: number;
  };
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const fmtCurrency = (paise: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);

/* ─── Role config ─────────────────────────────────────────────────────────── */
const roleConfig: Record<
  Role,
  { badge: string; icon: React.ElementType; label: string; avatar: string }
> = {
  STUDENT: {
    badge: "bg-sky-100 text-sky-700 border-sky-200",
    icon: BookOpen,
    label: "Student",
    avatar: "bg-sky-500",
  },
  TEACHER: {
    badge: "bg-violet-100 text-violet-700 border-violet-200",
    icon: GraduationCap,
    label: "Teacher",
    avatar: "bg-violet-500",
  },
  ADMIN: {
    badge: "bg-rose-100 text-rose-700 border-rose-200",
    icon: ShieldCheck,
    label: "Admin",
    avatar: "bg-rose-500",
  },
};

/* ─── Stat card ───────────────────────────────────────────────────────────── */
const StatCard = ({
  icon: Icon,
  label,
  value,
  sub,
  accent,
  solid = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
  solid?: boolean;
}) => {
  if (solid) {
    return (
      <div
        className={`relative bg-${accent}-600 rounded-2xl p-5 overflow-hidden shadow-md shadow-${accent}-200`}
      >
        <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10" />
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 mb-1">
            <Icon
              className={`w-3.5 h-3.5 text-${accent}-200`}
              strokeWidth={1.8}
            />
            <p
              className={`text-[10px] font-bold text-${accent}-200 uppercase tracking-widest`}
            >
              {label}
            </p>
          </div>
          <p className="text-3xl font-bold text-white">{value}</p>
          {sub && (
            <p className={`text-xs text-${accent}-200 font-medium mt-1`}>
              {sub}
            </p>
          )}
        </div>
      </div>
    );
  }
  return (
    <div
      className={`bg-white border border-${accent}-200 rounded-2xl px-5 py-4 shadow-sm`}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className={`w-3.5 h-3.5 text-${accent}-500`} strokeWidth={1.8} />
        <p
          className={`text-[10px] font-bold text-${accent}-600 uppercase tracking-wider`}
        >
          {label}
        </p>
      </div>
      <p className={`text-2xl font-bold text-${accent}-600`}>{value}</p>
      {sub && (
        <p className="text-[11px] text-neutral-400 font-medium mt-0.5">{sub}</p>
      )}
    </div>
  );
};

/* ─── Info row ────────────────────────────────────────────────────────────── */
const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3 py-3 border-b border-black/5 last:border-0">
    <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
      <Icon className="w-3.5 h-3.5 text-neutral-500" strokeWidth={1.8} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm font-semibold text-neutral-800 truncate mt-0.5">
        {value}
      </p>
    </div>
  </div>
);

/* ─── Main Component ──────────────────────────────────────────────────────── */
const AdminUserViewPageComponent = ({ id }: { id: string }) => {
  const { data, error, isLoading } = useUserByIdQuery(id);

  if (isLoading) return <Loading />;
  if (error || !data) return <Error />;

  const user = (data as { success: boolean; user: UserDetail }).user;

  const cfg = roleConfig[user.role];
  const RoleIcon = cfg.icon;
  const initials = user.name
    .trim()
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        {/* ── Back + header ── */}
        <div>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 font-semibold hover:text-black transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
            Back to Users
          </Link>
          <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-2">
            Admin Portal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-violet-600">
            User Profile
          </h1>
          <p className="text-sm text-neutral-400 font-medium mt-1">
            Detailed view of user account and activity
          </p>
        </div>

        {/* ── Profile hero card ── */}
        <div className="bg-white border border-black/8 rounded-2xl shadow-sm overflow-hidden">
          <div className="h-0.5 bg-violet-600 w-full" />
          <div className="p-6">
            <div className="flex items-start gap-5 flex-wrap">
              {/* Avatar */}
              <div
                className={`w-16 h-16 rounded-2xl ${cfg.avatar} flex items-center justify-center shrink-0 shadow-lg`}
              >
                <span className="text-xl font-bold text-white">{initials}</span>
              </div>

              {/* Name + meta */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl font-bold text-black">
                    {user.name.trim()}
                  </h2>
                  <span
                    className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border flex items-center gap-1 ${cfg.badge}`}
                  >
                    <RoleIcon className="w-3 h-3" strokeWidth={2} />
                    {cfg.label}
                  </span>
                </div>
                <p className="text-sm text-neutral-400 mt-1">{user.email}</p>
                <p className="text-xs text-neutral-400 font-medium mt-1.5">
                  Member since{" "}
                  <span className="text-neutral-600 font-semibold">
                    {fmtDate(user.createdAt)}
                  </span>
                </p>
              </div>

              {/* Block action */}
              <Link
                href={`/admin/users/${id}/block`}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-colors shrink-0"
              >
                Block User
              </Link>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {user.role === "TEACHER" && (
            <StatCard
              icon={BookOpen}
              label="Courses"
              value={user.stats.totalCourses}
              accent="violet"
              solid
            />
          )}
          {user.role === "STUDENT" && (
            <StatCard
              icon={Users}
              label="Enrollments"
              value={user.stats.totalEnrollments}
              accent="sky"
              solid
            />
          )}
          {user.role === "ADMIN" && (
            <StatCard
              icon={ShieldCheck}
              label="Role"
              value="Admin"
              accent="rose"
              solid
            />
          )}
          <StatCard
            icon={CreditCard}
            label="Payments"
            value={user.stats.totalPayments}
            accent="emerald"
          />
          <StatCard
            icon={Wallet}
            label="Wallet Balance"
            value={user.wallet ? fmtCurrency(user.wallet.balance) : "—"}
            accent="amber"
          />
          <StatCard
            icon={RefreshCw}
            label="Transactions"
            value={user.stats.totalWalletTransactions}
            sub="wallet activity"
            accent="sky"
          />
        </div>

        {/* ── Details + wallet ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Account details */}
          <div className="bg-white border border-black/8 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-black/5">
              <ShieldCheck
                className="w-4 h-4 text-violet-500"
                strokeWidth={1.8}
              />
              <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-widest">
                Account Details
              </h3>
            </div>
            <div className="px-5 py-2">
              <InfoRow icon={Mail} label="Email" value={user.email} />
              <InfoRow icon={RoleIcon} label="Role" value={cfg.label} />
              <InfoRow
                icon={Calendar}
                label="Joined"
                value={fmtDateTime(user.createdAt)}
              />
              <InfoRow
                icon={RefreshCw}
                label="Last Updated"
                value={fmtDateTime(user.updatedAt)}
              />
            </div>
          </div>

          {/* Wallet info */}
          <div className="bg-white border border-black/8 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-black/5">
              <Wallet className="w-4 h-4 text-amber-500" strokeWidth={1.8} />
              <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-widest">
                Wallet
              </h3>
            </div>

            {user.wallet ? (
              <div className="p-5 space-y-4">
                {/* Balance pill */}
                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-amber-50 border border-amber-100">
                  <div>
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                      Current Balance
                    </p>
                    <p className="text-2xl font-bold text-amber-600 mt-0.5">
                      {fmtCurrency(user.wallet.balance)}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow shadow-amber-200">
                    <Wallet className="w-5 h-5 text-white" strokeWidth={1.8} />
                  </div>
                </div>

                {/* Transaction count */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-50 border border-black/6">
                  <BarChart2
                    className="w-4 h-4 text-neutral-500 shrink-0"
                    strokeWidth={1.8}
                  />
                  <div>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                      Total Transactions
                    </p>
                    <p className="text-sm font-bold text-neutral-800 mt-0.5">
                      {user.wallet._count.transactions} transactions
                    </p>
                  </div>
                </div>

                <Link
                  href={`/admin/wallets/${user.wallet.id}`}
                  className="w-full h-9 flex items-center justify-center gap-2 rounded-xl bg-white border border-black/10 text-neutral-600 text-xs font-semibold hover:bg-neutral-50 transition-colors"
                >
                  View Wallet Transactions
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Wallet
                  className="w-8 h-8 text-neutral-200"
                  strokeWidth={1.5}
                />
                <p className="text-sm text-neutral-400 font-medium">
                  No wallet found
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Activity summary ── */}
        <div className="bg-white border border-black/8 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-black/5">
            <BarChart2 className="w-4 h-4 text-violet-500" strokeWidth={1.8} />
            <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-widest">
              Activity Summary
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-black/5">
            {[
              {
                icon: BookOpen,
                label:
                  user.role === "TEACHER"
                    ? "Courses Created"
                    : "Courses Browsed",
                value: user.role === "TEACHER" ? user.stats.totalCourses : "—",
                color: "text-violet-600",
              },
              {
                icon: Users,
                label: "Enrollments",
                value: user.stats.totalEnrollments,
                color: "text-sky-600",
              },
              {
                icon: CreditCard,
                label: "Payments",
                value: user.stats.totalPayments,
                color: "text-emerald-600",
              },
              {
                icon: RefreshCw,
                label: "Wallet Txns",
                value: user.stats.totalWalletTransactions,
                color: "text-amber-600",
              },
            ].map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center py-5 gap-1.5"
              >
                <Icon className={`w-4 h-4 ${color}`} strokeWidth={1.8} />
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider text-center px-2">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserViewPageComponent;
