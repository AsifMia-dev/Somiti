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

async function createSomiti({ managerId, name, collection_day, monthly_collection_date, netValue, handValue, loan_balance }) {
  if (!managerId) {
    const error = new Error('Manager is required');
    error.statusCode = 400;
    throw error;
  }

  const trimmedName = typeof name === 'string' ? name.trim() : '';
  if (!trimmedName) {
    const error = new Error('Somiti name is required');
    error.statusCode = 400;
    throw error;
  }

  const netWorth = toNumber(netValue, 'netValue');
  const cashBalance = toNumber(handValue, 'handValue');
  const loanBalance = toNumber(loan_balance, 'loan_balance');

  // verify manager exists
  const manager = await prisma.manager.findUnique({ where: { id: Number(managerId) } });
  if (!manager) {
    const error = new Error('Manager not found');
    error.statusCode = 404;
    throw error;
  }

  // ensure uniqueness
  const existingByName = await prisma.somiti.findUnique({ where: { name: trimmedName } });
  if (existingByName) {
    const error = new Error('Somiti with this name already exists');
    error.statusCode = 409;
    throw error;
  }

  const existingOwnerSomiti = await prisma.somiti.findUnique({ where: { owner_manager_id: Number(managerId) } });
  if (existingOwnerSomiti) {
    const error = new Error('This manager already owns a Somiti');
    error.statusCode = 409;
    throw error;
  }

  const somitiData = {
    name: trimmedName,
    owner_manager_id: Number(managerId),
    finance: {
      create: {
        net_worth: netWorth,
        cash_balance: cashBalance,
        loan_balance: loanBalance,
        total_fines: 0,
      },
    },
  };

  if (collection_day !== undefined) somitiData.collection_day = collection_day;
  if (monthly_collection_date !== undefined) somitiData.monthly_collection_date = monthly_collection_date;

  const somiti = await prisma.somiti.create({
    data: somitiData,
    include: {
      finance: true,
      owner_manager: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return { message: 'Somiti created successfully', data: somiti };
}

module.exports = { createSomiti };
