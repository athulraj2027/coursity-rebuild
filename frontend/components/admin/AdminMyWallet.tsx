"use client";

import React, { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  ShoppingBag,
  Wallet,
  IndianRupee,
  TrendingUp,
  CheckCircle,
  Clock,
} from "lucide-react";

import { DataTable } from "@/components/common/Table";
import Loading from "@/components/common/Loading";
import Error from "@/components/common/Error";
import { useMyWalletTransactionsQuery } from "@/queries/wallet.queries";

/* ─── Types ───────────────────────────────────────────────────────────────── */
type TransactionType = "CREDIT" | "DEBIT" | "REFUND" | "PURCHASE";

interface Transaction {
  id: string;
  walletId: string;
  amount: number;
  description: string;
  referenceId: string | null;
  type: TransactionType;
  payoutProofUrl: string | null;
  processedById: string | null;
  processedAt: string | null;
  createdAt: string;
}

interface WalletData {
  success: boolean;
  walletTransactionsWithBalance: {
    balance: number;
    transactions: Transaction[];
  };
}

type TransactionRow = {
  id: string;
  description: string;
  type: TransactionType;
  amount: number;
  referenceId: string | null;
  payoutProofUrl: string | null;
  processedById: string | null;
  processedAt: string | null;
  createdAt: string;
  rawCreatedAt: Date;
  rawProcessedAt: Date | null;
};

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

/* ─── Transaction config ──────────────────────────────────────────────────── */
const txConfig: Record<
  TransactionType,
  {
    icon: React.ElementType;
    badge: string;
    amount: string;
    label: string;
    isPositive: boolean;
  }
> = {
  CREDIT: {
    icon: ArrowDownLeft,
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    amount: "text-emerald-600",
    label: "Credit",
    isPositive: true,
  },
  DEBIT: {
    icon: ArrowUpRight,
    badge: "bg-rose-100 text-rose-700 border-rose-200",
    amount: "text-rose-600",
    label: "Debit",
    isPositive: false,
  },
  REFUND: {
    icon: RefreshCw,
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    amount: "text-amber-600",
    label: "Refund",
    isPositive: true,
  },
  PURCHASE: {
    icon: ShoppingBag,
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    amount: "text-blue-600",
    label: "Purchase",
    isPositive: false,
  },
};

/* ─── Columns ─────────────────────────────────────────────────────────────── */
const columns: ColumnDef<TransactionRow>[] = [
  {
    header: "SI.No",
    cell: ({ row }) => (
      <span className="text-neutral-400 font-medium text-sm">
        {row.index + 1}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ getValue }) => {
      const type = getValue<TransactionType>();
      const config = txConfig[type];
      const Icon = config.icon;
      return (
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 ${config.badge}`}
          >
            <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
          </div>
          <span
            className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${config.badge}`}
          >
            {config.label}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium text-neutral-800">
          {row.original.description}
        </p>
        {row.original.referenceId && (
          <p className="text-[10px] text-neutral-400 font-mono mt-0.5 truncate max-w-40">
            ref: {row.original.referenceId}
          </p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const config = txConfig[row.original.type];
      return (
        <span className={`text-sm font-bold ${config.amount}`}>
          {config.isPositive ? "+" : "−"}
          {fmt(Math.abs(row.original.amount))}
        </span>
      );
    },
  },
  {
    id: "processedAt",
    header: "Processed",
    cell: ({ row }) => {
      if (!row.original.rawProcessedAt) {
        return (
          <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border bg-amber-100 text-amber-600 border-amber-200 flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3" strokeWidth={2} />
            Pending
          </span>
        );
      }
      return (
        <div className="flex items-start gap-1.5">
          <CheckCircle
            className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5"
            strokeWidth={2}
          />
          <div>
            <p className="text-xs text-neutral-600 font-medium">
              {fmtDate(row.original.rawProcessedAt)}
            </p>
            <p className="text-[11px] text-neutral-400">
              {fmtTime(row.original.rawProcessedAt)}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    id: "payoutProofUrl",
    header: "Proof",
    cell: ({ row }) => {
      if (!row.original.payoutProofUrl) {
        return (
          <span className="text-[10px] text-neutral-400 font-medium">—</span>
        );
      }
      return (
        <a
          href={row.original.payoutProofUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-bold text-blue-600 underline underline-offset-2"
        >
          View Proof
        </a>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date & Time",
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium text-neutral-700">
          {fmtDate(row.original.rawCreatedAt)}
        </p>
        <p className="text-[11px] text-neutral-400 mt-0.5">
          {fmtTime(row.original.rawCreatedAt)}
        </p>
      </div>
    ),
  },
];

/* ─── Page Header ─────────────────────────────────────────────────────────── */
function PageHeader() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center">
          <Wallet className="w-3.5 h-3.5 text-white" strokeWidth={2} />
        </div>
        <span className="text-[10px] font-bold text-blue-500 tracking-widest uppercase">
          Admin Portal
        </span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-blue-500">
        Platform Wallet
      </h1>
      <p className="text-sm text-neutral-400 font-medium mt-1">
        Commission earnings and platform transaction history
      </p>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
const AdminMyWallet = () => {
  const { data, error, isLoading } = useMyWalletTransactionsQuery();

  const wallet = (data as WalletData | undefined)
    ?.walletTransactionsWithBalance;

  /* ── All hooks first ── */
  const tableData: TransactionRow[] = useMemo(() => {
    if (!wallet?.transactions) return [];
    return wallet.transactions.map((tx) => ({
      id: tx.id,
      description: tx.description,
      type: tx.type,
      amount: tx.amount,
      referenceId: tx.referenceId,
      payoutProofUrl: tx.payoutProofUrl,
      processedById: tx.processedById,
      processedAt: tx.processedAt,
      createdAt: tx.createdAt,
      rawCreatedAt: new Date(tx.createdAt),
      rawProcessedAt: tx.processedAt ? new Date(tx.processedAt) : null,
    }));
  }, [wallet]);

  const totalCredit = useMemo(
    () =>
      wallet?.transactions
        .filter((tx) => tx.type === "CREDIT" || tx.type === "REFUND")
        .reduce((s, tx) => s + tx.amount, 0) ?? 0,
    [wallet],
  );

  const totalDebit = useMemo(
    () =>
      wallet?.transactions
        .filter((tx) => tx.type === "DEBIT" || tx.type === "PURCHASE")
        .reduce((s, tx) => s + Math.abs(tx.amount), 0) ?? 0,
    [wallet],
  );

  const pendingCount = useMemo(
    () => wallet?.transactions.filter((tx) => !tx.processedAt).length ?? 0,
    [wallet],
  );

  /* ── Early returns after all hooks ── */
  if (isLoading) return <Loading />;
  if (error) return <Error />;

  if (!wallet) {
    return (
      <div className="min-h-screen bg-blue-50/40">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <PageHeader />
          <div className="flex flex-col items-center justify-center py-14 gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <IndianRupee
                className="w-5 h-5 text-blue-300"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-sm font-medium text-neutral-400 text-center max-w-sm">
              No transactions yet. Commission will be credited when students
              enroll in courses.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50/40">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <PageHeader />

        {/* Balance + stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {/* Balance */}
          <div className="relative bg-blue-500 rounded-2xl p-5 overflow-hidden shadow-md shadow-blue-200 col-span-2 sm:col-span-1">
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 mb-1">
                <Wallet
                  className="w-3.5 h-3.5 text-blue-200"
                  strokeWidth={1.8}
                />
                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">
                  Balance
                </p>
              </div>
              <p className="text-2xl font-bold text-white tracking-tight">
                {fmt(wallet.balance)}
              </p>
              <p className="text-xs text-blue-200 font-medium mt-1">
                {wallet.transactions.length} transactions
              </p>
            </div>
          </div>

          {/* Total In */}
          <div className="bg-white border border-emerald-200 rounded-2xl px-4 py-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <ArrowDownLeft
                className="w-3.5 h-3.5 text-emerald-500"
                strokeWidth={1.8}
              />
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                Total In
              </p>
            </div>
            <p className="text-xl font-bold text-emerald-600">
              {fmt(totalCredit)}
            </p>
          </div>

          {/* Total Out */}
          <div className="bg-white border border-rose-200 rounded-2xl px-4 py-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <ArrowUpRight
                className="w-3.5 h-3.5 text-rose-500"
                strokeWidth={1.8}
              />
              <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                Total Out
              </p>
            </div>
            <p className="text-xl font-bold text-rose-600">{fmt(totalDebit)}</p>
          </div>

          {/* Pending */}
          <div className="bg-white border border-amber-200 rounded-2xl px-4 py-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="w-3.5 h-3.5 text-amber-500" strokeWidth={1.8} />
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                Pending
              </p>
            </div>
            <p className="text-xl font-bold text-amber-600">{pendingCount}</p>
            <p className="text-[10px] text-neutral-400 font-medium mt-0.5">
              unprocessed
            </p>
          </div>
        </div>

        {/* Table card */}
        <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-4 py-3.5 border-b border-blue-50">
            <TrendingUp className="w-4 h-4 text-blue-500" strokeWidth={1.8} />
            <h2 className="text-xs font-bold text-neutral-700 uppercase tracking-widest">
              Transactions
            </h2>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-full">
              {tableData.length}
            </span>
          </div>

          {tableData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                <IndianRupee
                  className="w-5 h-5 text-blue-300"
                  strokeWidth={1.5}
                />
              </div>
              <p className="text-sm font-medium text-neutral-400">
                No transactions yet
              </p>
            </div>
          ) : (
            <DataTable columns={columns} data={tableData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMyWallet;
