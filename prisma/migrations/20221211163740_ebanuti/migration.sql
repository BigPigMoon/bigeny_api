/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `dialogs` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `dialogs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "dialogs" ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "dialogs_name_key" ON "dialogs"("name");
