const prisma = require('../lib/prisma');
const installmentService = require('./installmentService');

function toNumber(value, fieldName) {
  const number = Number(value);

  if (value === undefined || value === null || value === '' || Number.isNaN(number)) {
    const error = new Error(`${fieldName} is required and must be a number`);
    error.statusCode = 400;
    throw error;
  }

  return number;
}

function normalizeUuid(value, fieldName) {
  const normalized = typeof value === 'string' ? value.trim() : '';
  if (!normalized) {
    const error = new Error(`${fieldName} is required`);
    error.statusCode = 400;
    throw error;
  }
  return normalized;
}

async function ensureBorrowerExists(borrowerId) {
  const normalizedBorrowerId = normalizeUuid(borrowerId, 'borrowerId');
  const borrower = await prisma.borrower.findUnique({
    where: { id: normalizedBorrowerId },
    include: { somiti: true },
  });

  if (!borrower) {
    const error = new Error('Borrower not found');
    error.statusCode = 404;
    throw error;
  }

  return borrower;
}

async function createNewLoan(payload) {
  const {
    somitiId,
    loan_type,
    loan_amount,
    interest_rate,
    total_installment,
    savings,
    frequency,
    borrower_id,
  } = payload || {};

  if (loan_type !== 'NEW') return { message: 'Loan must be new' };

  if (!loan_type || !loan_amount || !borrower_id || !interest_rate || !total_installment) {
    const err = new Error('Missing required loan fields');
    err.statusCode = 400;
    throw err;
  }

  const normalizedBorrowerId = normalizeUuid(borrower_id, 'borrower_id');
  const borrower = await ensureBorrowerExists(normalizedBorrowerId);

  const existingActiveNew = await prisma.loan.findFirst({
    where: {
      borrower_id: normalizedBorrowerId,
      loan_type: 'NEW',
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
    borrower_id: normalizedBorrowerId,
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
    const somitiFinance = await tx.somitiFinance.findUnique({
      where: { somiti_id: borrower.somiti.id },
    });

    if (!somitiFinance) {
      const err = new Error('Somiti finance not found');
      err.statusCode = 404;
      throw err;
    }

    const availableCash = Number(somitiFinance.cash_balance || 0);
    if (loan_amt > availableCash) {
      const err = new Error('সমিতির নগদ ব্যালেন্স পর্যাপ্ত নয়');
      err.statusCode = 400;
      throw err;
    }

    const loan = await tx.loan.create({ data: loanData });

    await tx.loanAccount.create({
      data: { ...LoanAccountData, loan_id: loan.id },
    });

    await tx.somitiFinance.update({
      where: { somiti_id: borrower.somiti.id },
      data: {
        cash_balance: { decrement: loan_amt },
        loan_balance: { increment: loan_amt },
      },
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

async function getAllLoans(somitiId) {
  const normalizedSomitiId = normalizeUuid(somitiId, 'somitiId');
  
  const loanData = await prisma.loanAccount.findMany({
  where: { loan: { borrower: { somiti_id: normalizedSomitiId } } },
  select: {
        collected_amount: true,
        due_amount: true,
        fine: true,
        savings: true,
        status: true,
        loan: {
          select: {
            id: true,
            loan_amount: true,
            interest_rate: true,
            total_installment: true,
            completed_installment: true,
            borrower: {
              select: {
                full_name: true,
              },
            },
          },
        },
      },
    });

    console.log(loanData)

    return loanData;
}

async function getLoansByBorrower(borrowerId) {
  const value = typeof borrowerId === 'object' && borrowerId !== null ? borrowerId.borrowerId ?? borrowerId.id : borrowerId;
  const normalizedBorrowerId = normalizeUuid(value, 'borrowerId');

  return await prisma.loan.findMany({
    where: { borrower_id: normalizedBorrowerId },
    include: { borrower: true },
    orderBy: { created_at: 'desc' },
  });
}

async function getLoanById(id) {
  const normalizedId = normalizeUuid(id, 'loanId');

  const loan = await prisma.loan.findUnique({
    where: { id: normalizedId },
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
  const normalizedId = normalizeUuid(id, 'loanId');

  const loan = await prisma.loan.findUnique({ where: { id: normalizedId } });
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
    where: { id: normalizedId },
    data: updates,
    include: { borrower: true },
  });

  return { message: 'Loan updated successfully', data: updatedLoan };
}

async function deleteLoan(id) {
  const normalizedId = normalizeUuid(id, 'loanId');

  const loan = await prisma.loan.findUnique({ where: { id: normalizedId } });
  if (!loan) {
    const error = new Error('Loan not found');
    error.statusCode = 404;
    throw error;
  }

  await prisma.loan.delete({ where: { id: normalizedId } });

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
