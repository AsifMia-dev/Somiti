const prisma = require('../lib/prisma');

function toNumber(value) {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value) || 0;
  if (value.toString) return parseFloat(value.toString()) || 0;
  return 0;
}

async function getBalanceSummary(somitiId) {
  if (!somitiId || Number.isNaN(Number(somitiId))) {
    const err = new Error('Invalid somiti id');
    err.statusCode = 400;
    throw err;
  }

  const id = Number(somitiId);

  const finance = await prisma.somitiFinance.findUnique({ where: { somiti_id: id } });
  if (!finance) {
    const err = new Error('Somiti finance not found');
    err.statusCode = 404;
    throw err;
  }

  return {
    netValue: toNumber(finance.net_worth),
    loanBalance: toNumber(finance.loan_balance),
    cashBalance: toNumber(finance.cash_balance),
    fine: toNumber(finance.total_fines),
  };
}

module.exports = {
  getBalanceSummary,
};
