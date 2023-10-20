/*
  Warnings:

  - You are about to drop the column `position` on the `Draft` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Draft" DROP COLUMN "position";

-- AlterTable
ALTER TABLE "Tattoo" ADD COLUMN     "rawPrompt" TEXT,
ADD COLUMN     "style" TEXT;
