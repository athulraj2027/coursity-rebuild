/*
  Warnings:

  - Added the required column `price` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Lecture" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
