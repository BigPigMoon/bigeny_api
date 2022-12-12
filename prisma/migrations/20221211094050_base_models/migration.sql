/*
  Warnings:

  - You are about to drop the column `readed` on the `dialogs` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `from_id` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `avatarImg` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `_DialogToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `dialogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `dialogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Made the column `dialogId` on table `messages` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "_DialogToUser" DROP CONSTRAINT "_DialogToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_DialogToUser" DROP CONSTRAINT "_DialogToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_dialogId_fkey";

-- AlterTable
ALTER TABLE "dialogs" DROP COLUMN "readed",
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "date",
DROP COLUMN "from_id",
DROP COLUMN "text",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "dialogId" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatarImg",
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "background" TEXT;

-- DropTable
DROP TABLE "_DialogToUser";

-- CreateTable
CREATE TABLE "readStatus" (
    "readed" BOOLEAN NOT NULL DEFAULT false,
    "dialogId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "readStatus_pkey" PRIMARY KEY ("dialogId","userId")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "avatar" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subribe" (
    "channelId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Subribe_pkey" PRIMARY KEY ("channelId","userId")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rate" INTEGER NOT NULL DEFAULT 0,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "channelId" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Channel_name_key" ON "Channel"("name");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_dialogId_fkey" FOREIGN KEY ("dialogId") REFERENCES "dialogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "readStatus" ADD CONSTRAINT "readStatus_dialogId_fkey" FOREIGN KEY ("dialogId") REFERENCES "dialogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "readStatus" ADD CONSTRAINT "readStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subribe" ADD CONSTRAINT "Subribe_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subribe" ADD CONSTRAINT "Subribe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
