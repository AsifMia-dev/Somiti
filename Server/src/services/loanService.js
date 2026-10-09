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

module.exports = {
  createNewLoan,
  getAllLoans,
};
