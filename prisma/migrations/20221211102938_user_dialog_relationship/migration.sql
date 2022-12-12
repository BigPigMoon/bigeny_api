/*
  Warnings:

  - You are about to drop the column `userId` on the `channels` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `messages` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `channels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "channels" DROP CONSTRAINT "channels_userId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_userId_fkey";

-- AlterTable
ALTER TABLE "channels" DROP COLUMN "userId",
ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "userId",
ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "_DialogToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DialogToUser_AB_unique" ON "_DialogToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_DialogToUser_B_index" ON "_DialogToUser"("B");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DialogToUser" ADD CONSTRAINT "_DialogToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "dialogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DialogToUser" ADD CONSTRAINT "_DialogToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
