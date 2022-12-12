-- AlterTable
ALTER TABLE "channels" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "readStatuses" ALTER COLUMN "readed" SET DEFAULT true;
