/*
  Warnings:

  - You are about to drop the `Summary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Summary" DROP CONSTRAINT "Summary_eventId_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "summary" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "Summary";
