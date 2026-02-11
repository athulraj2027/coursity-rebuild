import Razorpay from "razorpay";
const RAZORPAY_KEY = process.env.RAZORPAY_KEY as string;
const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET as string;

export const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY,
  key_secret: RAZORPAY_SECRET,
});
