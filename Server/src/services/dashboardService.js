const prisma = require('../lib/prisma');

function toNumber(value) {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value) || 0;
  if (value.toString) return parseFloat(value.toString()) || 0;
  return 0;
}

async function getBalanceSummary(somitiId) {
  const id = somitiId;
   console.log(id);
  const finance = await prisma.somitiFinance.findUnique({ where: { somiti_id: id } });
  if (!finance) {
    const err = new Error('Somiti finance not found');
    err.statusCode = 404;
    throw err;
  }


  return {
    ...finance
  };
}

module.exports = {
  getBalanceSummary,
};
