import { prisma } from "../lib/prisma.js";

const createOtp = async (email: string, otp: string) => {
  return await prisma.otp.create({
    data: {
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 1 minutes
    },
  });
};

const findExistingOtp = async (email: string) => {
  return await prisma.otp.findFirst({
    where: {
      email,
      used: false,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const markOtpAsUsed = async (id: string) => {
  return await prisma.otp.update({
    where: { id },
    data: { used: true },
  });
};

const deleteOtpsByEmail = async (email: string) => {
  return await prisma.otp.deleteMany({ where: { email } });
};

export default { createOtp, findExistingOtp, markOtpAsUsed, deleteOtpsByEmail };
