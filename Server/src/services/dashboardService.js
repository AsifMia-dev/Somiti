const prisma = require('../lib/prisma');

async function getBalanceSummary(somitiId) {
  const id = typeof somitiId === 'string' ? somitiId.trim() : '';
  if (!id) {
    const err = new Error('Invalid somiti id');
    err.statusCode = 400;
    throw err;
  }

  const finance = await prisma.somitiFinance.findUnique({ where: { somiti_id: id } });
  if (!finance) {
    const err = new Error('Somiti finance not found');
    err.statusCode = 404;
    throw err;
  }
  return {
    ...finance,
  };
}

module.exports = {
  getBalanceSummary,
};
