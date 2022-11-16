-- CreateTable
CREATE TABLE "dialogs" (
    "id" SERIAL NOT NULL,
    "readed" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "dialogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DialogsOnUsers" (
    "userId" INTEGER NOT NULL,
    "dialogId" INTEGER NOT NULL,

    CONSTRAINT "DialogsOnUsers_pkey" PRIMARY KEY ("userId","dialogId")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT NOT NULL,
    "dialogId" INTEGER,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DialogsOnUsers" ADD CONSTRAINT "DialogsOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DialogsOnUsers" ADD CONSTRAINT "DialogsOnUsers_dialogId_fkey" FOREIGN KEY ("dialogId") REFERENCES "dialogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_dialogId_fkey" FOREIGN KEY ("dialogId") REFERENCES "dialogs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
