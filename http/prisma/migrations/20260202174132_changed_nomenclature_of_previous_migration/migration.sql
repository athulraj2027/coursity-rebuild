/*
  Warnings:

  - You are about to drop the column `enabledEnrollment` on the `Course` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "enabledEnrollment",
ADD COLUMN     "isEnrollmentOpen" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
