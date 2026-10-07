const prisma = require('../lib/prisma');

async function markOverdue({ somitiId, previousCollectionDate }) {
  return prisma.$transaction(async (tx) => {
    const rows = await tx.installment.findMany({
      where: {
        borrower: { somiti_id: somitiId },
        due_date: { lte: previousCollectionDate },
        status: 'PENDING',
        fine_amount: 0,
      },
      select: { id: true, installment_amount: true, loan_id: true },   // plus whatever the fine rule needs
    });

    let totalFine = 0;
    for (const r of rows) {
      const loan = await tx.loan.findUnique({
        where: { id: r.loan_id },
        select: { loan_amount: true, total_installment: true, interest_rate: true },
      });

      const fine = loan.loan_amount * loan.interest_rate / 100 / loan.total_installment;

      const claimed = await tx.installment.updateMany({
        where: { id: r.id, status: 'PENDING' },          
        data: { status: 'OVERDUE', fine_amount: fine },
      });
      if (claimed.count === 1) totalFine += fine;
    }

    if (totalFine > 0) {
      await tx.somitiFinance.update({
        where: { somiti_id: somitiId },
        data: { total_fines_outstanding: { increment: totalFine } },
      });
    }

  });
}



module.exports = { markOverdue };