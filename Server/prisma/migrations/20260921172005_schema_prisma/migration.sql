/*
  Warnings:

  - You are about to drop the column `due_amount` on the `Installment` table. All the data in the column will be lost.
  - You are about to drop the column `is_fine_paid` on the `Installment` table. All the data in the column will be lost.
  - You are about to drop the column `week_number` on the `Installment` table. All the data in the column will be lost.
  - You are about to drop the column `accumulation` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `principal_amount` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `weekly_installment_amount` on the `Loan` table. All the data in the column will be lost.
  - Added the required column `due_date` to the `Installment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `installNo` to the `Installment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collected_amount` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `due_amount` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `installment_amount` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interest_rate` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `loan_amount` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collection_day` to the `Somiti` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Weekday" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('WEEKLY', 'MONTHLY');

-- AlterTable
ALTER TABLE "Installment" DROP COLUMN "due_amount",
DROP COLUMN "is_fine_paid",
DROP COLUMN "week_number",
ADD COLUMN     "due_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "installNo" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Loan" DROP COLUMN "accumulation",
DROP COLUMN "principal_amount",
DROP COLUMN "weekly_installment_amount",
ADD COLUMN     "collected_amount" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "due_amount" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "fine" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "frequency" "Frequency" NOT NULL DEFAULT 'WEEKLY',
ADD COLUMN     "installment_amount" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "interest_rate" DECIMAL(5,2) NOT NULL,
ADD COLUMN     "loan_amount" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "savings" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Somiti" ADD COLUMN     "collection_day" "Weekday" NOT NULL,
ADD COLUMN     "monthly_collection_date" INTEGER NOT NULL DEFAULT 5;
