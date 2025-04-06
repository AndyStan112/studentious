/*
  Warnings:

  - The `summary` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Attachment" ALTER COLUMN "upploaderId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "summary",
ADD COLUMN     "summary" TEXT[];
