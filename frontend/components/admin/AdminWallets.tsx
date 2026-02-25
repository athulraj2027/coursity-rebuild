/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  Wallet,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import Loading from "../common/Loading";
import Error from "../common/Error";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { DataTable } from "../common/Table";
import { useAllWalletsQuery } from "@/queries/wallet.queries";
import WalletActions from "./actions/WalletActions";

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface WalletEntry {
  userId: string;
  name: string;
  email: string;
  role: string;
  currentBalance: number;
  totalCredits: number;
  totalDebits: number;
  totalRefunds: number;
  lastTransactionAt: string | null;
  lastPayoutAt: string | null;
}

interface WalletsResponse {
  success: boolean;
  walletsData: WalletEntry[];
}

type WalletTableRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  currentBalance: number;
  totalCredits: number;
  totalDebits: number;
  totalRefunds: number;
  rawLastTransaction: Date | null;
  rawLastPayout: Date | null;
};

type SortOption = {
  field:
    | "name"
    | "currentBalance"
    | "totalCredits"
    | "totalDebits"
    | "lastTransactionAt";
  direction: "asc" | "desc";
};

type FilterOptions = {
  balanceRange: "all" | "zero" | "under1000" | "1000to5000" | "above5000";
  creditsRange: "all" | "zero" | "under1000" | "1000to5000" | "above5000";
  payoutStatus: "all" | "paid" | "never";
};

const ITEMS_PER_PAGE = 10;

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const fmtTime = (d: Date) =>
  d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const DateCell = ({ d }: { d: Date | null; label?: string }) =>
  !d ? (
    <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border bg-neutral-100 text-neutral-400 border-neutral-200">
      Never
    </span>
  ) : (
    <div>
      <p className="text-xs text-neutral-600 font-medium">{fmtDate(d)}</p>
      <p className="text-[11px] text-neutral-400">{fmtTime(d)}</p>
    </div>
  );

/* ─── Columns ─────────────────────────────────────────────────────────────── */
const columns: ColumnDef<WalletTableRow>[] = [
  {
    id: "serial",
    header: "SI.No",
    cell: ({ row }) => (
      <span className="text-neutral-400 font-medium text-sm">
        {row.index + 1}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Teacher",
    cell: ({ row }) => {
      const initials = row.original.name
        .trim()
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
      return (
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-neutral-800 truncate">
              {row.original.name}
            </p>
            <p className="text-[11px] text-neutral-400 truncate">
              {row.original.email}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "currentBalance",
    header: "Balance",
    cell: ({ getValue }) => (
      <span className="text-sm font-bold text-violet-600">
        {fmt(getValue<number>() / 100)}
      </span>
    ),
  },
  {
    accessorKey: "totalCredits",
    header: "Credits",
    cell: ({ getValue }) => (
      <span className="text-sm font-bold text-emerald-600">
        {fmt(getValue<number>() / 100)}
      </span>
    ),
  },
  {
    accessorKey: "totalDebits",
    header: "Debits",
    cell: ({ getValue }) => {
      const val = getValue<number>() / 100;
      return (
        <span
          className={`text-sm font-bold ${val > 0 ? "text-rose-600" : "text-neutral-400"}`}
        >
          {fmt(val)}
        </span>
      );
    },
  },
  {
    accessorKey: "totalRefunds",
    header: "Refunds",
    cell: ({ getValue }) => {
      const val = getValue<number>() / 100;
      return (
        <span
          className={`text-sm font-bold ${val > 0 ? "text-amber-600" : "text-neutral-400"}`}
        >
          {fmt(val)}
        </span>
      );
    },
  },
  {
    id: "lastTransactionAt",
    header: "Last Transaction",
    cell: ({ row }) => <DateCell d={row.original.rawLastTransaction} />,
  },
  {
    id: "lastPayoutAt",
    header: "Last Payout",
    cell: ({ row }) => <DateCell d={row.original.rawLastPayout} />,
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <WalletActions userId={row.original.id} />,
  },
];

/* ─── Range select items ──────────────────────────────────────────────────── */
const RangeItems = () => (
  <>
    <SelectItem value="all">All</SelectItem>
    <SelectItem value="zero">Zero</SelectItem>
    <SelectItem value="under1000">Under ₹1,000</SelectItem>
    <SelectItem value="1000to5000">₹1,000 – ₹5,000</SelectItem>
    <SelectItem value="above5000">Above ₹5,000</SelectItem>
  </>
);

/* ─── Main Page ───────────────────────────────────────────────────────────── */
const AdminWalletsPage = () => {
  const { isLoading, data, error } = useAllWalletsQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>({
    field: "totalCredits",
    direction: "desc",
  });
  const [filters, setFilters] = useState<FilterOptions>({
    balanceRange: "all",
    creditsRange: "all",
    payoutStatus: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const wallets: WalletEntry[] =
    (data as WalletsResponse | undefined)?.walletsData ?? [];

  /* ── Hooks ── */
  const tableData: WalletTableRow[] = useMemo(
    () =>
      wallets.map((w) => ({
        id: w.userId,
        name: w.name,
        email: w.email,
        role: w.role,
        currentBalance: w.currentBalance,
        totalCredits: w.totalCredits,
        totalDebits: w.totalDebits,
        totalRefunds: w.totalRefunds,
        rawLastTransaction: w.lastTransactionAt
          ? new Date(w.lastTransactionAt)
          : null,
        rawLastPayout: w.lastPayoutAt ? new Date(w.lastPayoutAt) : null,
      })),
    [wallets],
  );

  const processedData = useMemo(() => {
    let filtered = [...tableData];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (w) =>
          w.name.toLowerCase().includes(q) || w.email.toLowerCase().includes(q),
      );
    }

    if (filters.payoutStatus !== "all") {
      filtered = filtered.filter((w) =>
        filters.payoutStatus === "paid"
          ? w.rawLastPayout !== null
          : w.rawLastPayout === null,
      );
    }

    const applyRange = (val: number, range: string) => {
      switch (range) {
        case "zero":
          return val === 0;
        case "under1000":
          return val > 0 && val < 1000;
        case "1000to5000":
          return val >= 1000 && val <= 5000;
        case "above5000":
          return val > 5000;
        default:
          return true;
      }
    };

    if (filters.balanceRange !== "all")
      filtered = filtered.filter((w) =>
        applyRange(w.currentBalance, filters.balanceRange),
      );
    if (filters.creditsRange !== "all")
      filtered = filtered.filter((w) =>
        applyRange(w.totalCredits, filters.creditsRange),
      );

    filtered.sort((a, b) => {
      let aVal: any, bVal: any;
      switch (sortOption.field) {
        case "name":
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case "currentBalance":
          aVal = a.currentBalance;
          bVal = b.currentBalance;
          break;
        case "totalCredits":
          aVal = a.totalCredits;
          bVal = b.totalCredits;
          break;
        case "totalDebits":
          aVal = a.totalDebits;
          bVal = b.totalDebits;
          break;
        case "lastTransactionAt":
          aVal = a.rawLastTransaction?.getTime() ?? 0;
          bVal = b.rawLastTransaction?.getTime() ?? 0;
          break;
        default:
          return 0;
      }
      if (aVal < bVal) return sortOption.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOption.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [tableData, searchQuery, sortOption, filters]);

  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);
  const paginatedData = processedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const totalBalance = useMemo(
    () => wallets.reduce((s, w) => s + w.currentBalance, 0),
    [wallets],
  );
  const totalCredits = useMemo(
    () => wallets.reduce((s, w) => s + w.totalCredits, 0),
    [wallets],
  );
  const totalDebits = useMemo(
    () => wallets.reduce((s, w) => s + w.totalDebits, 0),
    [wallets],
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOption, filters]);

  const activeFilterCount = [
    filters.balanceRange !== "all",
    filters.creditsRange !== "all",
    filters.payoutStatus !== "all",
    searchQuery !== "",
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;
  const clearFilters = () => {
    setSearchQuery("");
    setFilters({
      balanceRange: "all",
      creditsRange: "all",
      payoutStatus: "all",
    });
  };

  /* ── Early returns after all hooks ── */
  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-2">
            Admin Portal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-violet-600">
            Teacher Wallets
          </h1>
          <p className="text-sm text-neutral-400 font-medium mt-1">
            Monitor balances, credits, debits and payouts across all teachers
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
          <div className="relative bg-violet-600 rounded-2xl p-5 overflow-hidden shadow-md shadow-violet-200 col-span-2 sm:col-span-1">
            <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-white/10" />
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 mb-1">
                <Wallet
                  className="w-3.5 h-3.5 text-violet-200"
                  strokeWidth={1.8}
                />
                <p className="text-[10px] font-bold text-violet-200 uppercase tracking-widest">
                  Total Balance
                </p>
              </div>
              <p className="text-2xl font-bold text-white tracking-tight">
                {fmt(totalBalance / 100)}
              </p>
              <p className="text-xs text-violet-200 font-medium mt-1">
                {wallets.length} wallets
              </p>
            </div>
          </div>

          <div className="bg-white border border-emerald-200 rounded-2xl px-4 py-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <ArrowDownLeft
                className="w-3.5 h-3.5 text-emerald-500"
                strokeWidth={1.8}
              />
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                Credits
              </p>
            </div>
            <p className="text-xl font-bold text-emerald-600">
              {fmt(totalCredits / 100)}
            </p>
          </div>

          <div className="bg-white border border-rose-200 rounded-2xl px-4 py-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <ArrowUpRight
                className="w-3.5 h-3.5 text-rose-500"
                strokeWidth={1.8}
              />
              <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                Debits
              </p>
            </div>
            <p className="text-xl font-bold text-rose-600">
              {fmt(totalDebits / 100)}
            </p>
          </div>

          <div className="bg-white border border-sky-200 rounded-2xl px-4 py-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp
                className="w-3.5 h-3.5 text-sky-500"
                strokeWidth={1.8}
              />
              <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">
                Active
              </p>
            </div>
            <p className="text-xl font-bold text-sky-600">
              {wallets.filter((w) => w.lastTransactionAt).length}
            </p>
          </div>
        </div>

        {/* Empty state */}
        {tableData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border border-dashed border-black/15 rounded-2xl bg-white">
            <Wallet
              className="w-8 h-8 text-neutral-300 mb-3"
              strokeWidth={1.5}
            />
            <p className="text-neutral-400 text-sm font-medium">
              No wallets found
            </p>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative flex-1 min-w-62.5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Search by name or email..."
                  className="pl-10 bg-white border-black/10 rounded-xl focus-visible:ring-black/20 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select
                value={`${sortOption.field}-${sortOption.direction}`}
                onValueChange={(value) => {
                  const lastDash = value.lastIndexOf("-");
                  setSortOption({
                    field: value.slice(0, lastDash) as SortOption["field"],
                    direction: value.slice(
                      lastDash + 1,
                    ) as SortOption["direction"],
                  });
                }}
              >
                <SelectTrigger className="w-48 bg-white border-black/10 rounded-xl text-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="totalCredits-desc">
                    Highest Credits
                  </SelectItem>
                  <SelectItem value="totalCredits-asc">
                    Lowest Credits
                  </SelectItem>
                  <SelectItem value="currentBalance-desc">
                    Highest Balance
                  </SelectItem>
                  <SelectItem value="currentBalance-asc">
                    Lowest Balance
                  </SelectItem>
                  <SelectItem value="totalDebits-desc">Most Debits</SelectItem>
                  <SelectItem value="totalDebits-asc">Least Debits</SelectItem>
                  <SelectItem value="name-asc">Name (A–Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z–A)</SelectItem>
                  <SelectItem value="lastTransactionAt-desc">
                    Latest Activity
                  </SelectItem>
                  <SelectItem value="lastTransactionAt-asc">
                    Oldest Activity
                  </SelectItem>
                </SelectContent>
              </Select>

              <Popover open={showFilters} onOpenChange={setShowFilters}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 bg-white border-black/10 rounded-xl text-sm hover:bg-neutral-50"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {hasActiveFilters && (
                      <Badge className="ml-1 px-1.5 min-w-5 h-5 bg-black text-white text-[10px] rounded-full">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-64 rounded-2xl border-black/10 shadow-xl"
                  align="end"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-black text-sm">
                        Filters
                      </h4>
                      {hasActiveFilters && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="h-auto p-0 text-xs text-neutral-400 hover:text-black"
                        >
                          Clear all
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Payout Status
                      </p>
                      <Select
                        value={filters.payoutStatus}
                        onValueChange={(v: FilterOptions["payoutStatus"]) =>
                          setFilters((p) => ({ ...p, payoutStatus: v }))
                        }
                      >
                        <SelectTrigger className="rounded-xl border-black/10 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="paid">Has Payouts</SelectItem>
                          <SelectItem value="never">Never Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Balance Range
                      </p>
                      <Select
                        value={filters.balanceRange}
                        onValueChange={(v: FilterOptions["balanceRange"]) =>
                          setFilters((p) => ({ ...p, balanceRange: v }))
                        }
                      >
                        <SelectTrigger className="rounded-xl border-black/10 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <RangeItems />
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Credits Range
                      </p>
                      <Select
                        value={filters.creditsRange}
                        onValueChange={(v: FilterOptions["creditsRange"]) =>
                          setFilters((p) => ({ ...p, creditsRange: v }))
                        }
                      >
                        <SelectTrigger className="rounded-xl border-black/10 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <RangeItems />
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-2 text-neutral-400 hover:text-black rounded-xl"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>

            {/* Results count */}
            <p className="text-xs text-neutral-400 font-medium mb-4">
              Showing{" "}
              <span className="text-violet-600 font-semibold">
                {processedData.length}
              </span>{" "}
              of{" "}
              <span className="text-violet-600 font-semibold">
                {tableData.length}
              </span>{" "}
              wallets
            </p>

            {/* Table */}
            <div className="bg-white border border-black/8 rounded-2xl overflow-hidden shadow-sm">
              <DataTable columns={columns} data={paginatedData} />
            </div>

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
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - currentPage) <= 1,
                  )
                  .reduce<(number | "…")[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "…" ? (
                      <span
                        key={`e-${i}`}
                        className="w-8 h-8 flex items-center justify-center text-xs text-neutral-400"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p as number)}
                        className={`w-8 h-8 rounded-xl text-xs font-semibold border transition-all ${
                          currentPage === p
                            ? "bg-violet-600 text-white border-violet-600"
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
          </>
        )}
      </div>
    </div>
  );
};

export default AdminWalletsPage;
