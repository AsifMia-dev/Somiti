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

async function getBorrowerById(id) {
  const normalizedId = normalizeUuid(id, 'borrowerId');

  const borrower = await prisma.borrower.findUnique({ where: { id: normalizedId } });
  if (!borrower) {
    const err = new Error('Borrower not found');
    err.statusCode = 404;
    throw err;
  }

  return { data: borrower };
}

async function updateBorrower(id, payload) {
  const normalizedId = normalizeUuid(id, 'borrowerId');
  const updates = {};

  if (payload.nid) {
    const nidNumber = normalizeString(payload.nid);
    const existingNid = await prisma.borrower.findUnique({ where: { nid_number: nidNumber } });
    if (existingNid && existingNid.id !== normalizedId) {
      const err = new Error('NID already in use by another borrower');
      err.statusCode = 409;
      throw err;
    }
    updates.nid_number = nidNumber;
  }

  if (payload.phone !== undefined) {
    const phoneVal = payload.phone || null;
    if (phoneVal) {
      const existingPhone = await prisma.borrower.findFirst({ where: { phone: phoneVal } });
      if (existingPhone && existingPhone.id !== normalizedId) {
        const err = new Error('Phone number already in use by another borrower');
        err.statusCode = 409;
        throw err;
      }
    }
    updates.phone = phoneVal;
  }

  if (payload.fullName) updates.full_name = normalizeString(payload.fullName);
  if (payload.fatherName !== undefined) updates.father_name = normalizeString(payload.fatherName);
  if (payload.address !== undefined) updates.village_address = normalizeString(payload.address);

  const borrower = await prisma.borrower.update({ where: { id: normalizedId }, data: updates });

  return { message: 'Borrower updated', data: borrower };
}

async function deleteBorrower(id) {
  const normalizedId = normalizeUuid(id, 'borrowerId');

  await prisma.borrower.delete({ where: { id: normalizedId } });

  return { message: 'Borrower deleted' };
}

module.exports = {
  createBorrower,
  getBorrowers,
  getBorrowerById,
  updateBorrower,
  deleteBorrower,
};
