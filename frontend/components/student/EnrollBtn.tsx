"use client";
import React, { useState } from "react";
import { loadRazorpay } from "@/hooks/useRazorpay";
import {
  createOrderApi,
  verifyPaymentApi,
  VerifyPaymentResponse,
} from "@/services/payment.services";
import { toast } from "sonner";
import { Loader2, CreditCard, CheckCircle } from "lucide-react";
import EnrollmentSuccess from "./EnrollmentSuccess";

const EnrollBtn = ({
  courseId,
  disabled,
}: {
  courseId: string;
  disabled: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);

  // ✅ Show success component inline once payment is done
  if (enrollmentId) {
    return <EnrollmentSuccess enrollmentId={enrollmentId} />;
  }

  const handleEnroll = async () => {
    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      setLoading(true);
      const { res } = await createOrderApi(courseId);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY!,
        amount: res.amount,
        currency: res.currency,
        order_id: res.orderId,
        handler: async function (response: any) {
          const data: VerifyPaymentResponse = await verifyPaymentApi({
            ...response,
            courseId,
          });
          toast.success("Enrolled successfully 🎉");
          setEnrollmentId(data.enrollment_id); // ← triggers inline success view
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error(error.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleEnroll}
      disabled={disabled || loading}
      className="flex items-center justify-center gap-2 h-10 px-6 rounded-xl text-sm font-semibold border transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
        bg-black text-white border-black hover:bg-black/80 active:bg-black/90"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Processing…
        </>
      ) : disabled ? (
        <>
          <CheckCircle className="w-4 h-4" strokeWidth={2} />
          Already Enrolled
        </>
      ) : (
        <>
          <CreditCard className="w-4 h-4" strokeWidth={1.8} />
          Enroll Now
        </>
      )}
    </button>
  );
};

export default EnrollBtn;
