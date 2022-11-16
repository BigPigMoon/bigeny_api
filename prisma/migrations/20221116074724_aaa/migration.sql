-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_dialogId_fkey";

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "dialogId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_dialogId_fkey" FOREIGN KEY ("dialogId") REFERENCES "dialogs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
