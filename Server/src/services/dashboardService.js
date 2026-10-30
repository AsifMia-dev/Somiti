const prisma = require('../lib/prisma');

const {getCollectionDate} = require('./installmentService')

async function getBalanceSummary(somitiId) {

  const finance = await prisma.somitiFinance.findUnique({ where: { somiti_id: somitiId } });
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
