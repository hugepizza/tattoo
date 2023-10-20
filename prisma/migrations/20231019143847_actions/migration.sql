/*
  Warnings:

  - Made the column `actions` on table `Draft` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Draft" ADD COLUMN     "buttons" JSONB,
ALTER COLUMN "actions" SET NOT NULL,
ALTER COLUMN "actions" SET DATA TYPE TEXT;
