const { CodeIcon } = require('lucide-react');
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


async function ensureBorrowerExists(borrowerId) {
  const borrower = await prisma.borrower.findUnique({
    where: { id: borrowerId },
    include: { somiti: true },
  });

  if (!borrower) {
    const error = new Error('Borrower not found');
    error.statusCode = 404;
    throw error;
  }

  return borrower;
}

async function createLoan(payload) {
  const {
    somitiId,
    loan_type,
    loan_amount,
    interest_rate,
    total_installment,
    savings,
    frequency,
    borrower_id,
    completed_installment,
    loan_provided_date,
    total_fine_collected,
  } = payload || {};


  if (!loan_type || !loan_amount || !borrower_id || !interest_rate || !total_installment) {
    const err = new Error('প্রয়োজনীয় লোনের তথ্য অনুপস্থিত');
    err.statusCode = 400;
    throw err;
  }


  const borrower = await ensureBorrowerExists(borrower_id);
  

  const existingActive = await prisma.loan.findFirst({
    where: {
      borrower_id,
      account: { status: 'ACTIVE' },
    }
  });

  if (existingActive) {
    const err = new Error('গ্রহীতার ইতিমধ্যেই একটি সক্রিয় লোন রয়েছে, টপ আপ করুন');
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
  
  const completedInstallmentCount = loan_type === 'EXISTING'
    ? toNumber(completed_installment, 'completed_installment')
    : 0;

  const due_amount = accumulation - (completedInstallmentCount * installment_amount);

  const fine = loan_type === 'EXISTING'
  ? toNumber(total_fine_collected, 'total_fine_collected')
  : 0;

  const loanData = {
    loan_amount: loan_amt,
    interest_rate: interestRate,
    total_installment: totalInst,
    completed_installment:completedInstallmentCount,
    frequency: frequency || 'WEEKLY',
    borrower_id,
  };

  const LoanAccountData = {
    installment_amount,
    due_amount: Number(due_amount),
    savings: Savings,
    collected_amount: (completedInstallmentCount * installment_amount),
    fine: fine,
    status: 'ACTIVE',
  };

  return await prisma.$transaction(async (tx) => {
    const somitiFinance = await tx.somitiFinance.findUnique({
      where: { somiti_id: borrower.somiti.id },
    });

    if (!somitiFinance) {
      const err = new Error('সমিতি অর্থায়ন পাওয়া যায়নি');
      err.statusCode = 404;
      throw err;
    }

    if(loan_type == 'NEW'){
      const availableCash = Number(somitiFinance.cash_balance || 0);
      if (loan_amt > availableCash) {
        const err = new Error('সমিতির ক্যাশ পর্যাপ্ত নয়');
        err.statusCode = 400;
        throw err;
      }
    }

    const loan = await tx.loan.create({ data: loanData });

    await tx.loanAccount.create({
      data: { ...LoanAccountData, loan_id: loan.id },
    });

    const outstandingPrincipal = loan_amt - (completedInstallmentCount * (loan_amt / totalInst));

    // Update soitiFinance only when loan type new
    const financeUpdateData = loan_type === 'EXISTING'
    ? { loan_balance: { increment: outstandingPrincipal } }
    : {
        cash_balance: { decrement: loan_amt },
        loan_balance: { increment: loan_amt },
      };

    await tx.somitiFinance.update({
      where: { somiti_id: borrower.somiti.id },
      data: financeUpdateData,
    });

    const startDate = loan_type === 'EXISTING' ? new Date(loan_provided_date) : new Date();
    // 
    const created = await installmentService.generateInstallments(
      tx,
      loan.id,
      loan.borrower_id,
      installment_amount,
      loan.total_installment,
      loan.frequency,
      startDate,
      completedInstallmentCount
    );



    const message = loan_type === 'EXISTING'
      ? 'ঋণ সফলভাবে যুক্ত করা হয়েছে'
      : 'ঋণ সফলভাবে প্রদান করা হয়েছে';

      if (created.length !== loan.total_installment) {
        const err = new Error('ইনস্টলমেন্ট তৈরিতে সমস্যা হয়েছে');
        err.statusCode = 500;
        throw err;
      }

      return { message };
  });
}

async function getAllLoans(somitiId) {

  const loanData = await prisma.loanAccount.findMany({
  where: { loan: { borrower: { somiti_id: somitiId } } },
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
    
    return loanData;
}

module.exports = {
  createLoan,
  getAllLoans,
};
