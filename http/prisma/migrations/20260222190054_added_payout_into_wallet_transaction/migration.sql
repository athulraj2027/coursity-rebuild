-- AlterTable
ALTER TABLE "WalletTransaction" ADD COLUMN     "payoutProofUrl" TEXT,
ADD COLUMN     "processedAt" TIMESTAMP(3),
ADD COLUMN     "processedById" TEXT;
