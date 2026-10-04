/*
  Warnings:

  - You are about to drop the column `net_worth` on the `SomitiFinance` table. All the data in the column will be lost.
  - You are about to drop the column `total_fines` on the `SomitiFinance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SomitiFinance" DROP COLUMN "net_worth",
DROP COLUMN "total_fines",
ADD COLUMN     "total_fines_collected" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "total_fines_outstanding" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "total_interest_earned" DECIMAL(12,2) NOT NULL DEFAULT 0,
ALTER COLUMN "cash_balance" SET DEFAULT 0,
ALTER COLUMN "loan_balance" SET DEFAULT 0;
