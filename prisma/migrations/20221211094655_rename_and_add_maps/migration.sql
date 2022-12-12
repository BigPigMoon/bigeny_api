/*
  Warnings:

  - You are about to drop the `Channel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subribe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `readStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_userId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_channelId_fkey";

-- DropForeignKey
ALTER TABLE "Subribe" DROP CONSTRAINT "Subribe_channelId_fkey";

-- DropForeignKey
ALTER TABLE "Subribe" DROP CONSTRAINT "Subribe_userId_fkey";

-- DropForeignKey
ALTER TABLE "readStatus" DROP CONSTRAINT "readStatus_dialogId_fkey";

-- DropForeignKey
ALTER TABLE "readStatus" DROP CONSTRAINT "readStatus_userId_fkey";

-- DropTable
DROP TABLE "Channel";

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "Subribe";

-- DropTable
DROP TABLE "readStatus";

-- CreateTable
CREATE TABLE "readStatuses" (
    "readed" BOOLEAN NOT NULL DEFAULT false,
    "dialogId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "readStatuses_pkey" PRIMARY KEY ("dialogId","userId")
);

-- CreateTable
CREATE TABLE "channels" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "avatar" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subsribes" (
    "channelId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "subsribes_pkey" PRIMARY KEY ("channelId","userId")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rate" INTEGER NOT NULL DEFAULT 0,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "channelId" INTEGER NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "channels_name_key" ON "channels"("name");

-- AddForeignKey
ALTER TABLE "readStatuses" ADD CONSTRAINT "readStatuses_dialogId_fkey" FOREIGN KEY ("dialogId") REFERENCES "dialogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "readStatuses" ADD CONSTRAINT "readStatuses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subsribes" ADD CONSTRAINT "subsribes_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subsribes" ADD CONSTRAINT "subsribes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
