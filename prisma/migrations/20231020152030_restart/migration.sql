/*
  Warnings:

  - You are about to drop the `Draft` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tattoo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tattoo" DROP CONSTRAINT "Tattoo_draftId_fkey";

-- DropTable
DROP TABLE "Draft";

-- DropTable
DROP TABLE "Tattoo";

-- CreateTable
CREATE TABLE "Imagine" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "proxyId" TEXT NOT NULL,
    "proxyChannel" TEXT,
    "status" TEXT NOT NULL,
    "progress" TEXT NOT NULL,
    "actions" TEXT NOT NULL,
    "errorMessage" TEXT,
    "imageUrl" TEXT,
    "buttons" JSONB,
    "credits" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "rawPrompt" TEXT NOT NULL,
    "style" TEXT,

    CONSTRAINT "Imagine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Imagine_proxyId_key" ON "Imagine"("proxyId");
