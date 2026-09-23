const prisma = require('../lib/prisma');
const installmentService = require('./installmentService')

function toNumber(value, fieldName) {
  const number = Number(value);

  if (value === undefined || value === null || value === '' || Number.isNaN(number)) {
    const error = new Error(`${fieldName} is required and must be a number`);
    error.statusCode = 400;
    throw error;
  }

  return number;
}

async function ensureBorrowerExists(borrowerId) {
  const borrower = await prisma.borrower.findUnique({
    where: { id: Number(borrowerId) },
    include: { somiti: true },
  });

  if (!borrower) {
    const error = new Error('Borrower not found');
    error.statusCode = 404;
    throw error;
  }

  return borrower;
}

// Create New Loan
async function createNewLoan(payload) {
  const {
    loan_type,
    loan_amount,
    interest_rate,
    total_installment,
    savings,
    frequency,
    borrower_id
  } = payload || {};
  if(loan_type !== "NEW") return{ message : "Loan must me new"};

  if (!loan_type || !loan_amount || !borrower_id || !interest_rate || !total_installment) {
    const err = new Error("Missing required loan fields");
    err.statusCode = 400;
    throw err;
  }

  const borrower = await ensureBorrowerExists(borrower_id);

  // Prevent creating a new loan if borrower already has an ACTIVE loan of type NEW
  const existingActiveNew = await prisma.loan.findFirst({
    where: {
      borrower_id: Number(borrower_id),
      loan_type: 'NEW',
      // loan status is stored on LoanAccount.status
      account: { status: 'ACTIVE' },
    },
    include: { account: true },
  });

  if (existingActiveNew) {
    const err = new Error('Borrower already has an active NEW loan');
    err.statusCode = 400;
    throw err;
  }

  const loan_amt = toNumber(loan_amount, 'loan_amount');
  const totalInst = toNumber(total_installment, 'total_installment');
  const interestRate = toNumber(interest_rate, 'interest_rate');
  const Savings = savings !== undefined ? toNumber(savings, 'savings') : 0;

  const interest = loan_amt * (interestRate / 100);
  const accumulation = loan_amt + interest;
  const installment_amount = accumulation / totalInst;
  const due_amount = accumulation - Savings;

  const loanData = {
    loan_type,
    loan_amount: loan_amt,
    interest_rate: interestRate,
    total_installment: totalInst,
    frequency: frequency || 'WEEKLY',
    borrower_id: Number(borrower_id),
  };

  const LoanAccountData = {
    installment_amount,
    due_amount: Number(due_amount),
    savings: Savings,
    collected_amount: 0,
    fine: 0,
    status: 'ACTIVE',
  };

  return await prisma.$transaction(async (tx) => {
    const loan = await tx.loan.create({ data: loanData });

    const loanAcc = await tx.loanAccount.create({
      data: { ...LoanAccountData, loan_id: loan.id },
    });

    await installmentService.generateInstallments(
      tx,
      loan.id,
      loan.borrower_id,
      installment_amount,
      loan.total_installment,
      loan.frequency,
    );

    return { message: 'Loan created successfully', data: loan };
  });
}

async function getAllLoans() {
  return await prisma.loan.findMany({
    include: { borrower: true },
    orderBy: { created_at: 'desc' },
  });
}

async function getLoansByBorrower(borrowerId) {
  return await prisma.loan.findMany({
    where: { borrower_id: Number(borrowerId) },
    include: { borrower: true },
    orderBy: { created_at: 'desc' },
  });
}

async function getLoanById(id) {
  if (!id || Number.isNaN(Number(id))) {
    const error = new Error('Invalid loan id');
    error.statusCode = 400;
    throw error;
  }

  const loan = await prisma.loan.findUnique({
    where: { id: Number(id) },
    include: { borrower: true },
  });

  if (!loan) {
    const error = new Error('Loan not found');
    error.statusCode = 404;
    throw error;
  }

  return { data: loan };
}

async function updateLoan(id, payload = {}) {
  if (!id || Number.isNaN(Number(id))) {
    const error = new Error('Invalid loan id');
    error.statusCode = 400;
    throw error;
  }

  const loan = await prisma.loan.findUnique({ where: { id: Number(id) } });
  if (!loan) {
    const error = new Error('Loan not found');
    error.statusCode = 404;
    throw error;
  }

  const updates = {};

  if (payload.principalAmount !== undefined) {
    updates.principal_amount = toNumber(payload.principalAmount, 'principalAmount');
  }

  if (payload.total_installment !== undefined) {
    updates.total_installment = toNumber(payload.total_installment, 'total_installment');
  }

  if (payload.weeklyinstallment_amount !== undefined) {
    updates.weekly_installment_amount = toNumber(payload.weeklyinstallment_amount, 'weeklyinstallment_amount');
  }

  if (payload.status !== undefined) {
    updates.status = payload.status;
  }

  if (payload.accumulation !== undefined) {
    updates.accumulation = toNumber(payload.accumulation, 'accumulation');
  }

  const updatedLoan = await prisma.loan.update({
    where: { id: Number(id) },
    data: updates,
    include: { borrower: true },
  });

  return { message: 'Loan updated successfully', data: updatedLoan };
}

async function deleteLoan(id) {
  if (!id || Number.isNaN(Number(id))) {
    const error = new Error('Invalid loan id');
    error.statusCode = 400;
    throw error;
  }

  const loan = await prisma.loan.findUnique({ where: { id: Number(id) } });
  if (!loan) {
    const error = new Error('Loan not found');
    error.statusCode = 404;
    throw error;
  }

  await prisma.loan.delete({ where: { id: Number(id) } });

  return { message: 'Loan deleted successfully' };
}

module.exports = {
  createNewLoan,
  getAllLoans,
  getLoansByBorrower,
  getLoanById,
  updateLoan,
  deleteLoan,
};
