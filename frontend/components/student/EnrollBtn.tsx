"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { loadRazorpay } from "@/hooks/useRazorpay";
import { createOrderApi, verifyPaymentApi } from "@/services/payment.services";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loading from "../common/Loading";

const EnrollBtn = ({ courseId }: { courseId: string }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleEnroll = async () => {
    try {
      const loaded = await loadRazorpay();
      if (!loaded) return alert("Razorpay SDK failed");

      setLoading(true);
      const { res } = await createOrderApi(courseId);
      setLoading(false);
      //   console.log("type of amount", typeof res.amount);
      //return order_amount, currency, order_id
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY!,
        amount: res.amount,
        currency: res.currency,
        order_id: res.orderId,

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async function (response: any) {
          await verifyPaymentApi({
            ...response,
            courseId,
          });

          toast.success("Enrolled successfully 🎉");
          router.push(`/student`);
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  if (loading) return null;
  return <Button onClick={handleEnroll}>Enroll Now</Button>;
};

export default EnrollBtn;
