/*
  Warnings:

  - You are about to drop the column `joinTime` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `leaveTime` on the `Attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "joinTime",
DROP COLUMN "leaveTime";
