-- AlterTable
ALTER TABLE "Attachment" ADD COLUMN     "upploaderId" TEXT NOT NULL DEFAULT 'user_2uK6FLjSSJX1tmqcL5QfGii9Jum';

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_upploaderId_fkey" FOREIGN KEY ("upploaderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
