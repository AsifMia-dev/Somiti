/*
  Warnings:

  - The primary key for the `Borrower` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Installment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Loan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LoanAccount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Manager` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Somiti` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SomitiFinance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[nid_number,somiti_id]` on the table `Borrower` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `id` on the `Borrower` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `somiti_id` on the `Borrower` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Installment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `borrower_id` on the `Installment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `loan_id` on the `Installment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Loan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `borrower_id` on the `Loan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `LoanAccount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `loan_id` on the `LoanAccount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Manager` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Somiti` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `owner_manager_id` on the `Somiti` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `SomitiFinance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `somiti_id` on the `SomitiFinance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Borrower" DROP CONSTRAINT "Borrower_somiti_id_fkey";

-- DropForeignKey
ALTER TABLE "Installment" DROP CONSTRAINT "Installment_borrower_id_fkey";

-- DropForeignKey
ALTER TABLE "Installment" DROP CONSTRAINT "Installment_loan_id_fkey";

-- DropForeignKey
ALTER TABLE "Loan" DROP CONSTRAINT "Loan_borrower_id_fkey";

-- DropForeignKey
ALTER TABLE "LoanAccount" DROP CONSTRAINT "LoanAccount_loan_id_fkey";

-- DropForeignKey
ALTER TABLE "Somiti" DROP CONSTRAINT "Somiti_owner_manager_id_fkey";

-- DropForeignKey
ALTER TABLE "SomitiFinance" DROP CONSTRAINT "SomitiFinance_somiti_id_fkey";

-- DropIndex
DROP INDEX "Borrower_nid_number_key";

-- AlterTable
ALTER TABLE "Borrower" DROP CONSTRAINT "Borrower_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "somiti_id",
ADD COLUMN     "somiti_id" UUID NOT NULL,
ADD CONSTRAINT "Borrower_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Installment" DROP CONSTRAINT "Installment_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "borrower_id",
ADD COLUMN     "borrower_id" UUID NOT NULL,
DROP COLUMN "loan_id",
ADD COLUMN     "loan_id" UUID NOT NULL,
ALTER COLUMN "due_date" SET DATA TYPE DATE,
ADD CONSTRAINT "Installment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Loan" DROP CONSTRAINT "Loan_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "borrower_id",
ADD COLUMN     "borrower_id" UUID NOT NULL,
ADD CONSTRAINT "Loan_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "LoanAccount" DROP CONSTRAINT "LoanAccount_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "loan_id",
ADD COLUMN     "loan_id" UUID NOT NULL,
ADD CONSTRAINT "LoanAccount_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Manager" DROP CONSTRAINT "Manager_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Manager_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Somiti" DROP CONSTRAINT "Somiti_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "owner_manager_id",
ADD COLUMN     "owner_manager_id" UUID NOT NULL,
ADD CONSTRAINT "Somiti_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SomitiFinance" DROP CONSTRAINT "SomitiFinance_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "somiti_id",
ADD COLUMN     "somiti_id" UUID NOT NULL,
ADD CONSTRAINT "SomitiFinance_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "Borrower_somiti_id_idx" ON "Borrower"("somiti_id");

-- CreateIndex
CREATE UNIQUE INDEX "Borrower_nid_number_somiti_id_key" ON "Borrower"("nid_number", "somiti_id");

-- CreateIndex
CREATE INDEX "Installment_borrower_id_idx" ON "Installment"("borrower_id");

-- CreateIndex
CREATE INDEX "Installment_loan_id_idx" ON "Installment"("loan_id");

-- CreateIndex
CREATE INDEX "Loan_borrower_id_idx" ON "Loan"("borrower_id");

-- CreateIndex
CREATE UNIQUE INDEX "LoanAccount_loan_id_key" ON "LoanAccount"("loan_id");

-- CreateIndex
CREATE UNIQUE INDEX "Somiti_owner_manager_id_key" ON "Somiti"("owner_manager_id");

-- CreateIndex
CREATE INDEX "Somiti_owner_manager_id_idx" ON "Somiti"("owner_manager_id");

-- CreateIndex
CREATE UNIQUE INDEX "SomitiFinance_somiti_id_key" ON "SomitiFinance"("somiti_id");

-- AddForeignKey
ALTER TABLE "Somiti" ADD CONSTRAINT "Somiti_owner_manager_id_fkey" FOREIGN KEY ("owner_manager_id") REFERENCES "Manager"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Borrower" ADD CONSTRAINT "Borrower_somiti_id_fkey" FOREIGN KEY ("somiti_id") REFERENCES "Somiti"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_borrower_id_fkey" FOREIGN KEY ("borrower_id") REFERENCES "Borrower"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanAccount" ADD CONSTRAINT "LoanAccount_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "Loan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Installment" ADD CONSTRAINT "Installment_borrower_id_fkey" FOREIGN KEY ("borrower_id") REFERENCES "Borrower"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Installment" ADD CONSTRAINT "Installment_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "Loan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SomitiFinance" ADD CONSTRAINT "SomitiFinance_somiti_id_fkey" FOREIGN KEY ("somiti_id") REFERENCES "Somiti"("id") ON DELETE CASCADE ON UPDATE CASCADE;
