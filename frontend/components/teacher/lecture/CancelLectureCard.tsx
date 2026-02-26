"use client";
import React, { use, useState } from "react";
import { AlertTriangle, X, Trash2, Loader2, ArrowLeft } from "lucide-react";
import { cancelLecture } from "@/services/lecture.services";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const CancelLectureCard = ({
  lectureId,
  onClose,
}: {
  lectureId: string;
  onClose?: () => void;
}) => {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      // deleting api

      await cancelLecture(lectureId)
        .then(async () => {
          await queryClient.invalidateQueries({ queryKey: ["my-lectures"] });
          toast.success(`Lecture has been deleted successfully`);
          return;
        })
        .catch((err) => {
          toast.error(err.message);
        });
    } finally {
      setIsDeleting(false);
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
        <div className="h-0.5 bg-rose-500 w-full" />

        {/* Close */}
        {onClose && (
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors z-10 disabled:opacity-40"
          >
            <X className="w-3.5 h-3.5 text-neutral-500" strokeWidth={2} />
          </button>
        )}

        <div className="p-6 space-y-5">
          {/* Icon + heading */}
          <div className="flex flex-col items-center text-center gap-3 pt-2">
            <div className="w-14 h-14 rounded-full bg-rose-50 border-2 border-rose-100 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-200">
                <AlertTriangle className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
            </div>
            <div>
              <h2 className="text-base font-bold text-black tracking-tight">
                Cancel Lecture?
              </h2>
              <p className="text-xs text-neutral-400 font-medium mt-1 leading-relaxed max-w-xs">
                This action cannot be undone.
                <br /> The lecture will be permanently cancelled
                <br /> and students will be notified.
              </p>
            </div>
          </div>

          <div className="h-px bg-black/5" />

          {/* Warning note */}
          <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-rose-50 border border-rose-100">
            <AlertTriangle
              className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5"
              strokeWidth={2}
            />
            <p className="text-[11px] text-rose-600 font-medium leading-relaxed">
              Any scheduled participants will lose access to this session.
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 active:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Cancelling…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" strokeWidth={2} />
                  Yes, Cancel Lecture
                </>
              )}
            </button>

            <button
              onClick={onClose}
              disabled={isDeleting}
              className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-white border border-black/10 text-neutral-600 text-sm font-semibold hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelLectureCard;
