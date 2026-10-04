/*
  Warnings:

  - You are about to drop the column `collected_amount` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `due_amount` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `fine` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Loan` table. All the data in the column will be lost.
  - Added the required column `loan_type` to the `Loan` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LoanType" AS ENUM ('NEW', 'TOP_UP');

-- AlterTable
ALTER TABLE "Loan" DROP COLUMN "collected_amount",
DROP COLUMN "due_amount",
DROP COLUMN "fine",
DROP COLUMN "status",
ADD COLUMN     "loan_type" "LoanType" NOT NULL;

-- CreateTable
CREATE TABLE "LoanAccount" (
    "id" SERIAL NOT NULL,
    "collected_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "due_amount" DECIMAL(12,2) NOT NULL,
    "fine" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "LoanStatus" NOT NULL DEFAULT 'ACTIVE',
    "loan_id" INTEGER NOT NULL,

    CONSTRAINT "LoanAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LoanAccount_loan_id_key" ON "LoanAccount"("loan_id");

-- AddForeignKey
ALTER TABLE "LoanAccount" ADD CONSTRAINT "LoanAccount_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "Loan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
