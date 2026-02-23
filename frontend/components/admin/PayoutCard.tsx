"use client";
import {
  ImagePlus,
  X,
  CheckCircle,
  Loader2,
  Wallet,
  Banknote,
} from "lucide-react";
import React, { useState } from "react";
import FileUploadCompact from "../compact-upload";
import { FileWithPreview } from "@/hooks/use-file-upload";
import { useVerifyPayment } from "@/hooks/useVerifyPayment";
import { Input } from "../ui/input";

const PayoutCard = ({
  userId,
  onClose,
}: {
  userId: string;
  onClose?: () => void;
}) => {
  const { verifyPayment } = useVerifyPayment();

  const [images, setImages] = useState<FileWithPreview[]>([]);
  const [fileUploadKey, setFileUploadKey] = useState(0);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const hasImage = images.length > 0;
  const parsedAmount = parseFloat(amount);
  const isAmountValid = !isNaN(parsedAmount) && parsedAmount > 0;
  const canSubmit = hasImage && isAmountValid && !isSubmitting;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    if (amountError) setAmountError("");
  };

  const handleVerify = async () => {
    // validate amount
    if (!isAmountValid) {
      setAmountError("Please enter a valid amount greater than 0.");
      return;
    }
    if (!hasImage) return;

    setIsSubmitting(true);
    try {
      const res = await verifyPayment(images[0], userId, parsedAmount);
      if (!res?.success) {
        setDone(false);
        return
      }
      setDone(true);
    } finally {
      setIsSubmitting(false);
      setFileUploadKey((k) => k + 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backdropFilter: "blur(6px)",
        backgroundColor: "rgba(0,0,0,0.45)",
      }}
    >
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl ring-1 ring-black/8 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">
        {/* Top accent */}
        <div className="h-0.5 bg-violet-600 w-full" />

        {/* Close */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors z-10"
          >
            <X className="w-3.5 h-3.5 text-neutral-500" strokeWidth={2} />
          </button>
        )}

        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shrink-0">
              <Wallet className="w-4 h-4 text-white" strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-black tracking-tight">
                Verify Payout
              </h2>
              <p className="text-[11px] text-neutral-400 font-medium mt-0.5">
                Upload payment screenshot to confirm
              </p>
            </div>
          </div>

          <div className="h-px bg-black/6" />

          {done ? (
            /* ── Success ── */
            <div className="flex flex-col items-center justify-center py-6 gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <CheckCircle
                  className="w-6 h-6 text-emerald-500"
                  strokeWidth={2}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-neutral-800">
                  Payment Verified
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  The payout of ₹{parsedAmount.toLocaleString("en-IN")} has been
                  confirmed.
                </p>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="mt-1 h-9 px-5 rounded-xl bg-black text-white text-sm font-semibold hover:bg-black/80 transition-all"
                >
                  Done
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Amount */}
              <div className="space-y-1.5">
                <label
                  htmlFor="payout-amount"
                  className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 uppercase tracking-wider"
                >
                  <Banknote className="w-3.5 h-3.5" strokeWidth={1.8} />
                  Amount (₹)
                </label>
                <Input
                  id="payout-amount"
                  type="number"
                  min={1}
                  placeholder="e.g. 500"
                  value={amount}
                  onChange={handleAmountChange}
                  className={`rounded-xl bg-neutral-50 focus-visible:ring-black/20 text-sm placeholder:text-neutral-400 ${
                    amountError
                      ? "border-rose-400 focus-visible:ring-rose-200"
                      : "border-black/10"
                  }`}
                />
                {amountError && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {amountError}
                  </p>
                )}
              </div>

              {/* Screenshot */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                  <ImagePlus className="w-3.5 h-3.5" strokeWidth={1.8} />
                  Payment Screenshot
                </label>
                <div
                  className={`rounded-xl border-2 border-dashed transition-colors duration-150 ${
                    hasImage
                      ? "border-violet-300 bg-violet-50/50"
                      : "border-black/10 bg-neutral-50"
                  }`}
                >
                  <FileUploadCompact
                    key={fileUploadKey}
                    maxFiles={1}
                    accept="image/*"
                    onFilesChange={(files) => setImages(files)}
                  />
                </div>
                {hasImage && (
                  <p className="text-[11px] text-violet-600 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" strokeWidth={2} />
                    {images[0].file.name}
                  </p>
                )}
              </div>

              {/* Note */}
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Upload a clear screenshot of the payment confirmation.
                <br />
                This will be stored as proof of payout.
              </p>

              {/* Submit */}
              <button
                onClick={handleVerify}
                disabled={!canSubmit}
                className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 active:bg-violet-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying…
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" strokeWidth={2} />
                    Verify Payment
                    {isAmountValid && (
                      <span className="ml-1 text-violet-200 font-normal">
                        · ₹{parsedAmount.toLocaleString("en-IN")}
                      </span>
                    )}
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayoutCard;
