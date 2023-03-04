/*
  Warnings:

  - You are about to drop the `rate` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `like` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userLike` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "rate" DROP CONSTRAINT "rate_postId_fkey";

-- DropForeignKey
ALTER TABLE "rate" DROP CONSTRAINT "rate_userId_fkey";

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "like" INTEGER NOT NULL,
ADD COLUMN     "userLike" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "rate";
