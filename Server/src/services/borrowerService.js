const prisma = require('../lib/prisma');

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

async function createBorrower({ fullName, phone, nid, fatherName, address, somitiId }) {
  if (!fullName || !phone || !nid || !fatherName || !address || somitiId === undefined || somitiId === null) {
    const err = new Error('All field required');
    err.statusCode = 400;
    throw err;
  }

  // Extract numeric somiti id safely (accept number, numeric string, or object with id/sub/somitiId)
  function extractNumericId(v) {
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    if (typeof v === 'string' && v.trim() !== '') {
      const n = Number(v);
      if (!Number.isNaN(n)) return n;
    }
    if (typeof v === 'object' && v !== null) {
      if (typeof v.id === 'number' && Number.isFinite(v.id)) return v.id;
      if (typeof v.sub === 'number' && Number.isFinite(v.sub)) return v.sub;
      if (typeof v.somitiId === 'number' && Number.isFinite(v.somitiId)) return v.somitiId;
      if (typeof v.id === 'string' && v.id.trim() !== '') {
        const n = Number(v.id);
        if (!Number.isNaN(n)) return n;
      }
    }
    return null;
  }

  const somitiNumericId = extractNumericId(somitiId);
  if (somitiNumericId === null) {
    const err = new Error('Invalid somiti');
    err.statusCode = 400;
    throw err;
  }

  const somiti = await prisma.somiti.findUnique({ where: { id: Number(somitiNumericId) } });
  if (!somiti) {
    const err = new Error('Somiti not found');
    err.statusCode = 404;
    throw err;
  }

  const name = normalizeString(fullName);
  const nidNumber = normalizeString(nid);
  const father = normalizeString(fatherName);
  const village = normalizeString(address);


  const existing = await prisma.borrower.findUnique({ where: { nid_number: nidNumber } });
  if (existing) {
    const err = new Error('Borrower with this NID already exists');
    err.statusCode = 409;
    throw err;
  }

  const borrower = await prisma.borrower.create({
    data: {
      full_name: name,
      phone: phone || null,
      nid_number: nidNumber,
      father_name: father || null,
      village_address: village || null,
      somiti_id: Number(somitiNumericId),
    },
  });

  return {
    message: 'Borrower created successfully',
    data: borrower,
  };
}

async function getBorrowers(somitiId) {
  if (!somitiId || Number.isNaN(Number(somitiId))) {
    const err = new Error('Invalid somiti');
    err.statusCode = 400;
    throw err;
  }

  const borrowers = await prisma.borrower.findMany({ where: { somiti_id: Number(somitiId) }, orderBy: { created_at: 'desc' } });

  return { data: borrowers };
}

async function getBorrowerById(id) {
  if (!id || Number.isNaN(Number(id))) {
    const err = new Error('Invalid borrower id');
    err.statusCode = 400;
    throw err;
  }

  const borrower = await prisma.borrower.findUnique({ where: { id: Number(id) } });
  if (!borrower) {
    const err = new Error('Borrower not found');
    err.statusCode = 404;
    throw err;
  }

  return { data: borrower };
}

async function updateBorrower(id, payload) {
  if (!id || Number.isNaN(Number(id))) {
    const err = new Error('Invalid borrower');
    err.statusCode = 400;
    throw err;
  }
  const updates = {};

  if (payload.nid) {
    const nidNumber = normalizeString(payload.nid);
    const existingNid = await prisma.borrower.findUnique({ where: { nid_number: nidNumber } });
    if (existingNid && existingNid.id !== Number(id)) {
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
      if (existingPhone && existingPhone.id !== Number(id)) {
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

  const borrower = await prisma.borrower.update({ where: { id: Number(id) }, data: updates });

  return { message: 'Borrower updated', data: borrower };
}

async function deleteBorrower(id) {
  if (!id || Number.isNaN(Number(id))) {
    const err = new Error('Invalid borrower id');
    err.statusCode = 400;
    throw err;
  }

  await prisma.borrower.delete({ where: { id: Number(id) } });

  return { message: 'Borrower deleted' };
}

module.exports = {
  createBorrower,
  getBorrowers,
  getBorrowerById,
  updateBorrower,
  deleteBorrower,
};
