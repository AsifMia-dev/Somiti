const prisma = require('../lib/prisma');

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
  });

  if (!borrower) {
    const error = new Error('Borrower not found');
    error.statusCode = 404;
    throw error;
  }

  return borrower;
}

async function createLoan({borrowerId,principalAmount,totalInstallment,weeklyInstallmentAmount,status,accumulation,}) {
  if (!borrowerId) {
    const error = new Error('Borrower is required');
    error.statusCode = 400;
    throw error;
  }

  await ensureBorrowerExists(borrowerId);

  const principal = toNumber(principalAmount, 'principalAmount');
  const totalInstallments = toNumber(totalInstallment, 'totalInstallment');
  const weeklyAmount = toNumber(weeklyInstallmentAmount, 'weeklyInstallmentAmount');
  const accum = accumulation === undefined ? principal : toNumber(accumulation, 'accumulation');

  const loan = await prisma.loan.create({
    data: {
      borrower_id: Number(borrowerId),
      principal_amount: principal,
      total_installment: totalInstallments,
      weekly_installment_amount: weeklyAmount,
      status: status || 'ACTIVE',
      accumulation: accum,
    },
    include: {
      borrower: true,
    },
  });

  return {
    message: 'Loan created successfully',
    data: loan,
  };
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

  if (payload.totalInstallment !== undefined) {
    updates.total_installment = toNumber(payload.totalInstallment, 'totalInstallment');
  }

  if (payload.weeklyInstallmentAmount !== undefined) {
    updates.weekly_installment_amount = toNumber(payload.weeklyInstallmentAmount, 'weeklyInstallmentAmount');
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
  createLoan,
  getAllLoans,
  getLoansByBorrower,
  getLoanById,
  updateLoan,
  deleteLoan,
};
