const prisma = require('../lib/prisma');

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
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

async function createBorrower({ fullName, phone, nid, fatherName, address, somitiId }) {
  const normalizedSomitiId = normalizeUuid(somitiId, 'somitiId');

  const somiti = await prisma.somiti.findUnique({ where: { id: normalizedSomitiId } });
  if (!somiti) {
    const err = new Error('সমিতি পাওয়া যায়নি');
    err.statusCode = 404;
    throw err;
  }

  const name = normalizeString(fullName);
  const nidNumber = normalizeString(nid);
  const father = normalizeString(fatherName);
  const village = normalizeString(address);

  const existing = await prisma.borrower.findUnique({
    where: {
      nid_number_somiti_id: {
        nid_number: nidNumber,
        somiti_id: normalizedSomitiId,
      },
    },
  });

  if (existing) {
    const error = new Error('এই জাতীয় পরিচয়পত্র নম্বর দিয়ে ইতিমধ্যে নিবন্ধিত আছে');
    error.statusCode = 409;
    throw error;
  }

  const borrower = await prisma.borrower.create({
    data: {
      full_name: name,
      phone: phone || null,
      nid_number: nidNumber,
      father_name: father || null,
      village_address: village || null,
      somiti_id: normalizedSomitiId,
    },
  });

  return {
    message: 'ঋণগ্রহীতা নিবন্ধন সম্পন্ন হয়েছে',
    data: borrower,
  };
}

async function getBorrowers(somitiId) {
  const normalizedSomitiId = normalizeUuid(somitiId, 'somitiId');

  const borrowers = await prisma.borrower.findMany({
    where: { somiti_id: normalizedSomitiId },
    orderBy: { created_at: 'desc' },
  });

  return { data: borrowers };
}

async function getEligibleBorrowers({ somitiId, loanType, userId }) {
  const somiti = await prisma.somiti.findUnique({
    where: { id: somitiId },
    select: { id: true },
  });
  if (!somiti) {
    const error = new Error('Not found');
    error.statusCode = 404;
    throw error;
  }

  const where = { somiti_id: somitiId };

  if (loanType === 'NEW' || loanType === 'EXISTING') {
    where.loans = { 
      none: {
         account: {
           status: 'ACTIVE' 
         } 
      } 
    };
  } else if (loanType === 'RENEW') {
    where.loans = {
      some: {
        account: { status: 'ACTIVE' }
      }
    };
  } else {
    const error = new Error('ঋণের ধরন অবশ্যই নতুন, নবায়ন অথবা বিদ্যমান হতে হবে।');
    error.statusCode = 400;
    throw error;
  }

  return prisma.borrower.findMany({
    where,
    select: { id: true, full_name: true },
    orderBy: { full_name: 'asc' },
  });
}



module.exports = {
  createBorrower,
  getBorrowers,
  getEligibleBorrowers
};
