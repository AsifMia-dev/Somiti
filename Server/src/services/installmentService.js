const prisma = require('../lib/prisma');

const DAY_MAP = {
  SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3,
  THURSDAY: 4, FRIDAY: 5, SATURDAY: 6,
};

function getFirstDueDate(frequency, collectionDay, monthlyCollectionDate) {
  if (frequency === 'WEEKLY') {
    const targetDay = DAY_MAP[collectionDay];

    const date = new Date();
    const currentDay = date.getDay();
    let daysUntil = (targetDay - currentDay + 7) % 7;
    if (daysUntil === 0) daysUntil = 7;

    date.setDate(date.getDate() + daysUntil);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  if (frequency === 'MONTHLY') {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    if (date.getDate() >= monthlyCollectionDate) {
      date.setMonth(date.getMonth() + 1); // already past this month's date → next month
    }
    date.setDate(monthlyCollectionDate);
    return date;
  }

  throw new Error(`Unsupported frequency: ${frequency}`);
}



async function generateInstallments(tx, loan_id, borrower_id, installment_amount, total_installment, frequency){
    const borrower = await tx.borrower.findUnique({
        where: { id: borrower_id },
        include: { somiti: true },
    });

    const { collection_day, monthly_collection_date } = borrower.somiti;
    
    const firstDueDate = getFirstDueDate(frequency, collection_day, monthly_collection_date);

    const installments = [];

    for (let i = 0; i < total_installment; i++) {
    const dueDate = new Date(firstDueDate);

    if (frequency === 'WEEKLY') {
      dueDate.setDate(dueDate.getDate() + i * 7);
    } else if (frequency === 'MONTHLY') {
      dueDate.setMonth(dueDate.getMonth() + i);
    }

    installments.push({
      installNo: i + 1,
      due_date: dueDate,
      installment_amount,
      status: 'PENDING',
      fine_amount: 0,
      borrower_id,
      loan_id,
    });
  }

  if (installments.length === 0) return [];

  const created = [];
  for (const inst of installments) {
    const rec = await tx.installment.create({ data: inst });
    created.push(rec);
  }

  return created;
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

async function fetchInstallmentsDue(somitiId, collectionDate, lastCollectionDate) {
  const normalizedSomitiId = normalizeUuid(somitiId, 'somitiId');
  const rows = await prisma.installment.findMany({
    where: {
      borrower: { somiti_id: normalizedSomitiId },
      OR: [
        { due_date: { gt: lastCollectionDate, lte: collectionDate } },
        { due_date: { lte: lastCollectionDate }, status: 'OVERDUE' },
      ],
    },
    orderBy: { due_date: 'asc' },
    select: {
      id: true,
      loan_id: true,
      installNo: true,
      due_date: true,
      installment_amount: true,
      status: true,
      fine_amount: true,
      borrower_id: true,
      borrower: { select: { full_name: true } },
    },
  });

  return {
    thisWeek: rows.filter((r) => r.due_date > lastCollectionDate),
    overdue: rows.filter((r) => r.due_date <= lastCollectionDate),
  };
}

const getCollectionDate = (collectionDay, monthlyCollectionDate, frequency) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let collectionDate;

  if (frequency === 'WEEKLY') {
    const targetDay = DAY_MAP[collectionDay];
    if (targetDay === undefined) {
      throw new Error(`Invalid collection day: ${collectionDay}`);
    }
    const daysUntil = (targetDay - today.getDay() + 7) % 7; // 0 when today is the day
    collectionDate = new Date(today);
    collectionDate.setDate(today.getDate() + daysUntil);
  } else if (frequency === 'MONTHLY') {
    // clamp so day 31 doesn't overflow in shorter months
    const buildDate = (year, month) => {
      const lastDay = new Date(year, month + 1, 0).getDate();
      return new Date(year, month, Math.min(monthlyCollectionDate, lastDay));
    };

    collectionDate = buildDate(today.getFullYear(), today.getMonth());

    // only move to next month if this month's date has already passed
    if (collectionDate < today) {
      collectionDate = buildDate(today.getFullYear(), today.getMonth() + 1);
    }
  } else {
    throw new Error(`Unsupported frequency: ${frequency}`);
  }

  const daysUntil = Math.round((collectionDate - today) / (1000 * 60 * 60 * 24));

  return {
    collectionDate,
    isCollectionDay: daysUntil === 0,
    daysUntil,
  };
};


async function getCollectionSheet({ somitiId }) {
  const normalizedSomitiId = normalizeUuid(somitiId, 'somitiId');

  const somiti = await prisma.somiti.findUnique({
    where: { id: normalizedSomitiId },
  });

  const collectionInfo = getCollectionDate(somiti.collection_day, somiti.monthly_collection_date, 'WEEKLY');

  const lastCollectionDate = new Date(collectionInfo.collectionDate);
  lastCollectionDate.setDate(lastCollectionDate.getDate() - 7);

  const installments = await fetchInstallmentsDue(normalizedSomitiId, collectionInfo.collectionDate, lastCollectionDate);

  return { collectionInfo, installments };
}

async function collect({ somitiId, installmentId }) {
  const normalizedSomitiId = normalizeUuid(somitiId, 'somitiId');
  const normalizedInstallmentId = normalizeUuid(installmentId, 'installmentId');

  return prisma.$transaction(async (tx) => {
    const inst = await tx.installment.findFirst({
      where: { id: normalizedInstallmentId, borrower: { somiti_id: normalizedSomitiId } },
      select: { id: true, loan_id: true, installment_amount: true, fine_amount: true },
    });
    if (!inst) {
      const error = new Error('কিস্তি পাওয়া যায়নি');
      error.statusCode = 404;
      throw error;
    }

    const claimed = await tx.installment.updateMany({
      where: { id: inst.id, status: { in: ['PENDING', 'OVERDUE'] } },
      data: { status: 'PAID', collected_at: new Date() },
    });
    if (claimed.count === 0) {
      const error = new Error('এই কিস্তি আগেই আদায় হয়েছে');
      error.statusCode = 409;
      throw error;
    }

    const amount = Number(inst.installment_amount);
    const fine = Number(inst.fine_amount ?? 0);
    const totalCollected = amount + fine;

    // bump the counter and read the loan terms in one query
    const loan = await tx.loan.update({
      where: { id: inst.loan_id },
      data: { completed_installment: { increment: 1 } },
      select: {
        loan_amount: true,
        interest_rate: true,
        total_installment: true,
        completed_installment: true,
      },
    });

    const interestPart = Number(
      ((Number(loan.loan_amount) * Number(loan.interest_rate)) / 100 / loan.total_installment).toFixed(2)
    );
    const principalPart = amount - interestPart;

    await tx.somitiFinance.update({
      where: { somiti_id: normalizedSomitiId },
      data: {
        cash_balance: { increment: totalCollected },
        loan_balance: { decrement: principalPart },
        total_interest_earned: { increment: interestPart },
        total_fines_collected: { increment: fine },
        total_fines_outstanding: { decrement: fine },
      },
    });

    await tx.loanAccount.update({
      where: { loan_id: inst.loan_id },
      data: {
        collected_amount: { increment: amount },
        due_amount: { decrement: amount },
      },
    });

    const loanCompleted = loan.completed_installment >= loan.total_installment;
    if (loanCompleted) {
      await tx.loanAccount.update({
        where: { loan_id: inst.loan_id },
        data: { status: 'COMPLETED' },
      });
    }

    return {
      installmentId: inst.id,
      status: 'PAID',
      amount,
      fine,
      loanCompleted,
    };
  });
}


module.exports={
    generateInstallments,
    getCollectionSheet,
    collect,
    getCollectionDate
}