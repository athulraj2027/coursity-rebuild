/*
  Warnings:

  - Added the required column `imageUrl` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "enabledEnrollment" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDisabled" BOOLEAN NOT NULL DEFAULT false;
