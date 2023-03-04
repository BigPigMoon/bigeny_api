/*
  Warnings:

  - You are about to drop the column `like` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `userLike` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "like",
DROP COLUMN "userLike";

-- CreateTable
CREATE TABLE "rate" (
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "rate_pkey" PRIMARY KEY ("userId","postId")
);

-- AddForeignKey
ALTER TABLE "rate" ADD CONSTRAINT "rate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rate" ADD CONSTRAINT "rate_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
