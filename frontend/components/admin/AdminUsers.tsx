/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useUsersQuery } from "@/queries/admin/users.queries";
import React, { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  Users,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Loading from "@/components/common/Loading";
import Error from "@/components/common/Error";

/* ─── Types ───────────────────────────────────────────────────────────────── */
type Role = "STUDENT" | "TEACHER" | "ADMIN";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

interface UsersResponse {
  success: boolean;
  users: User[];
}

type SortOption = "newest" | "oldest" | "name-asc" | "name-desc";

const ITEMS_PER_PAGE = 10;

/* ─── Role config ─────────────────────────────────────────────────────────── */
const roleConfig: Record<Role, { badge: string; icon: React.ElementType; label: string; avatar: string }> = {
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

/* ─── Main Component ──────────────────────────────────────────────────────── */
const AdminUsersPage = () => {
  const { data, error, isLoading } = useUsersQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const users: User[] = (data as UsersResponse | undefined)?.users ?? [];

  const processedUsers = useMemo(() => {
    let filtered = [...users];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    filtered.sort((a, b) => {
      switch (sortOption) {
        case "newest": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "name-asc": return a.name.trim().localeCompare(b.name.trim());
        case "name-desc": return b.name.trim().localeCompare(a.name.trim());
        default: return 0;
      }
    });

    return filtered;
  }, [users, searchQuery, sortOption, roleFilter]);

  const totalPages = Math.ceil(processedUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = processedUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  React.useEffect(() => { setCurrentPage(1); }, [searchQuery, sortOption, roleFilter]);

  const hasActiveFilters = roleFilter !== "all" || searchQuery !== "";
  const clearFilters = () => { setSearchQuery(""); setRoleFilter("all"); };

  const counts = useMemo(() => ({
    total: users.length,
    students: users.filter((u) => u.role === "STUDENT").length,
    teachers: users.filter((u) => u.role === "TEACHER").length,
    admins: users.filter((u) => u.role === "ADMIN").length,
  }), [users]);

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-2">
            Admin Portal
          </p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-violet-600">
                Users
              </h1>
              <p className="text-sm text-neutral-400 font-medium mt-1">
                Manage all registered users across the platform
              </p>
            </div>
            <span className="text-xs text-neutral-400 font-medium shrink-0">
              <span className="text-neutral-800 font-semibold">{processedUsers.length}</span> of{" "}
              <span className="text-neutral-800 font-semibold">{users.length}</span> users
            </span>
          </div>
        </div>

        {/* Summary pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { icon: Users, label: `${counts.total} Total`, cls: "bg-white border-black/8 text-neutral-600", iconcls: "text-neutral-500" },
            { icon: GraduationCap, label: `${counts.teachers} Teachers`, cls: "bg-violet-50 border-violet-200 text-violet-700", iconcls: "text-violet-500" },
            { icon: BookOpen, label: `${counts.students} Students`, cls: "bg-sky-50 border-sky-200 text-sky-700", iconcls: "text-sky-500" },
            { icon: ShieldCheck, label: `${counts.admins} Admins`, cls: "bg-rose-50 border-rose-200 text-rose-700", iconcls: "text-rose-500" },
          ].map(({ icon: Icon, label, cls, iconcls }) => (
            <div key={label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm text-xs font-semibold ${cls}`}>
              <Icon className={`w-3.5 h-3.5 ${iconcls}`} strokeWidth={1.8} />
              {label}
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative flex-1 min-w-62.5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search by name or email..."
              className="pl-10 bg-white border-black/10 rounded-xl focus-visible:ring-black/20 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={sortOption} onValueChange={(v: SortOption) => setSortOption(v)}>
            <SelectTrigger className="w-44 bg-white border-black/10 rounded-xl text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name (A–Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z–A)</SelectItem>
            </SelectContent>
          </Select>

          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 bg-white border-black/10 rounded-xl text-sm hover:bg-neutral-50">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge className="ml-1 px-1.5 min-w-5 h-5 bg-black text-white text-[10px] rounded-full">
                    {[roleFilter !== "all" ? 1 : 0, searchQuery ? 1 : 0].reduce((a, b) => a + b, 0)}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-60 rounded-2xl border-black/10 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-black">Filters</p>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto p-0 text-xs text-neutral-400 hover:text-black">
                      Clear all
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Role</p>
                  <Select value={roleFilter} onValueChange={(v: any) => setRoleFilter(v)}>
                    <SelectTrigger className="rounded-xl border-black/10 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="STUDENT">Student</SelectItem>
                      <SelectItem value="TEACHER">Teacher</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2 text-neutral-400 hover:text-black rounded-xl">
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>

        {/* User list */}
        {paginatedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-56 border border-dashed border-black/15 rounded-2xl bg-white">
            <Users className="w-8 h-8 text-neutral-300 mb-2" strokeWidth={1.5} />
            <p className="text-sm font-medium text-neutral-400">No users match your filters</p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs text-black underline mt-2 font-medium">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white border border-black/8 rounded-2xl overflow-hidden shadow-sm">
            {paginatedUsers.map((user, idx) => {
              const config = roleConfig[user.role];
              const RoleIcon = config.icon;
              const initials = user.name.trim().split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
              const isLast = idx === paginatedUsers.length - 1;

              return (
                <div
                  key={user.id}
                  className={`flex items-center gap-4 px-5 py-3.5 hover:bg-neutral-50 transition-colors duration-150 ${!isLast ? "border-b border-black/5" : ""}`}
                >
                  {/* SI */}
                  <span className="text-xs text-neutral-400 font-medium w-5 shrink-0 hidden sm:block">
                    {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                  </span>

                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-full ${config.avatar} flex items-center justify-center shrink-0`}>
                    <span className="text-xs font-bold text-white">{initials}</span>
                  </div>

                  {/* Name + email */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-800 truncate">{user.name.trim()}</p>
                    <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                  </div>

                  {/* Role badge */}
                  <span className={`shrink-0 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border flex items-center gap-1 ${config.badge}`}>
                    <RoleIcon className="w-3 h-3" strokeWidth={2} />
                    {config.label}
                  </span>

                  {/* Joined date */}
                  <div className="hidden sm:block shrink-0 text-right">
                    <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Joined</p>
                    <p className="text-xs font-medium text-neutral-600 mt-0.5">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="w-8 h-8 rounded-xl border border-black/10 bg-white flex items-center justify-center hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce<(number | "…")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <span key={`e-${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-neutral-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p as number)}
                    className={`w-8 h-8 rounded-xl text-xs font-semibold border transition-all ${
                      currentPage === p
                        ? "bg-black text-white border-black"
                        : "bg-white text-neutral-600 border-black/10 hover:bg-neutral-50"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="w-8 h-8 rounded-xl border border-black/10 bg-white flex items-center justify-center hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;