-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('ACTIVE', 'PAID');

-- CreateEnum
CREATE TYPE "InstallmentStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE');

-- CreateTable
CREATE TABLE "Manager" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password_hash" TEXT NOT NULL,
    "google_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Somiti" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner_manager_id" INTEGER NOT NULL,

    CONSTRAINT "Somiti_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Borrower" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT,
    "nid_number" TEXT NOT NULL,
    "father_name" TEXT,
    "village_address" TEXT,
    "photo_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "somiti_id" INTEGER NOT NULL,

    CONSTRAINT "Borrower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Loan" (
    "id" SERIAL NOT NULL,
    "principal_amount" DECIMAL(12,2) NOT NULL,
    "total_installment" INTEGER NOT NULL,
    "weekly_installment_amount" DECIMAL(12,2) NOT NULL,
    "status" "LoanStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accumulation" DECIMAL(12,2) NOT NULL,
    "borrower_id" INTEGER NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Installment" (
    "id" SERIAL NOT NULL,
    "week_number" INTEGER NOT NULL,
    "installment_amount" DECIMAL(12,2) NOT NULL,
    "status" "InstallmentStatus" NOT NULL DEFAULT 'PENDING',
    "fine_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "is_fine_paid" BOOLEAN NOT NULL DEFAULT false,
    "collected_at" TIMESTAMP(3),
    "due_amount" DECIMAL(12,2) NOT NULL,
    "borrower_id" INTEGER NOT NULL,
    "loan_id" INTEGER NOT NULL,

    CONSTRAINT "Installment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SomitiFinance" (
    "id" SERIAL NOT NULL,
    "net_worth" DECIMAL(12,2) NOT NULL,
    "cash_balance" DECIMAL(12,2) NOT NULL,
    "loan_balance" DECIMAL(12,2) NOT NULL,
    "total_fines" DECIMAL(12,2) NOT NULL,
    "somiti_id" INTEGER NOT NULL,

    CONSTRAINT "SomitiFinance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Manager_username_key" ON "Manager"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Manager_email_key" ON "Manager"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Manager_google_id_key" ON "Manager"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "Somiti_name_key" ON "Somiti"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Somiti_owner_manager_id_key" ON "Somiti"("owner_manager_id");

-- CreateIndex
CREATE INDEX "Somiti_owner_manager_id_idx" ON "Somiti"("owner_manager_id");

-- CreateIndex
CREATE UNIQUE INDEX "Borrower_nid_number_key" ON "Borrower"("nid_number");

-- CreateIndex
CREATE INDEX "Borrower_somiti_id_idx" ON "Borrower"("somiti_id");

-- CreateIndex
CREATE INDEX "Loan_borrower_id_idx" ON "Loan"("borrower_id");

-- CreateIndex
CREATE INDEX "Installment_borrower_id_idx" ON "Installment"("borrower_id");

-- CreateIndex
CREATE INDEX "Installment_loan_id_idx" ON "Installment"("loan_id");

-- CreateIndex
CREATE UNIQUE INDEX "SomitiFinance_somiti_id_key" ON "SomitiFinance"("somiti_id");

-- AddForeignKey
ALTER TABLE "Somiti" ADD CONSTRAINT "Somiti_owner_manager_id_fkey" FOREIGN KEY ("owner_manager_id") REFERENCES "Manager"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Borrower" ADD CONSTRAINT "Borrower_somiti_id_fkey" FOREIGN KEY ("somiti_id") REFERENCES "Somiti"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_borrower_id_fkey" FOREIGN KEY ("borrower_id") REFERENCES "Borrower"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Installment" ADD CONSTRAINT "Installment_borrower_id_fkey" FOREIGN KEY ("borrower_id") REFERENCES "Borrower"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Installment" ADD CONSTRAINT "Installment_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "Loan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SomitiFinance" ADD CONSTRAINT "SomitiFinance_somiti_id_fkey" FOREIGN KEY ("somiti_id") REFERENCES "Somiti"("id") ON DELETE CASCADE ON UPDATE CASCADE;
