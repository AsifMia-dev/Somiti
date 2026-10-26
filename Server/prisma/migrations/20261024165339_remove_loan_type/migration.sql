/*
  Warnings:

  - You are about to drop the column `loan_type` on the `Loan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Loan" DROP COLUMN "loan_type";

-- DropEnum
DROP TYPE "LoanType";
