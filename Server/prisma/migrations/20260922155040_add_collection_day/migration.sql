/*
  Warnings:

  - You are about to drop the column `installment_amount` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `savings` on the `Loan` table. All the data in the column will be lost.
  - Added the required column `installment_amount` to the `LoanAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Loan" DROP COLUMN "installment_amount",
DROP COLUMN "savings";

-- AlterTable
ALTER TABLE "LoanAccount" ADD COLUMN     "installment_amount" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "savings" DECIMAL(12,2) NOT NULL DEFAULT 0;
