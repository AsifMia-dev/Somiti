const prisma = require('../lib/prisma');

function getFirstDueDate(frequency, collectionDay, monthlyCollectionDate) {
  if (frequency === 'WEEKLY') {
    const dayMap = {
      SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3,
      THURSDAY: 4, FRIDAY: 5, SATURDAY: 6,
    };
    const targetDay = dayMap[collectionDay];

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



async function fetchInstallmentsDue(somitiId, nextCollectionDate) {
  return await prisma.installment.findMany({
    where: {
      due_date: { lte: nextCollectionDate },
      loan: {
        borrower: { somiti_id: Number(somitiId) },
      },
    },
    orderBy: { due_date: 'asc' },
    include: {
      loan: true,
      borrower: { select: { id: true, full_name: true, phone: true } },
    },
  });
}


// installment.service.js
async function getCurrentWeekInstallments({somitiId}) {
   const somiti = await prisma.somiti.findUnique({
    where: { id: Number(somitiId) },
  });

  const nextCollectionDate = getFirstDueDate(
    'WEEKLY',
    somiti.collection_day,
    somiti.monthly_collection_date,
  );

  const installments = await fetchInstallmentsDue(somitiId, nextCollectionDate);

  return { somiti, nextCollectionDate, installments };
}



module.exports={
    generateInstallments,
    getCurrentWeekInstallments,
}