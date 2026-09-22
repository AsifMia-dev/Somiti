const borrowerService = require('../services/borrowerService');

async function createBorrower(req, res) {
  try {
    const { fullName, phone, nid, fatherName, address } = req.body;

    const somitiId = req.params;

    const result = await borrowerService.createBorrower({ fullName, phone, nid, fatherName, address, somitiId });

    return res.status(201).json(result);
  } catch (err) {
    const status = err.statusCode || 500;
    const message = err.message || 'Borrower creation failed';
    return res.status(status).json({ error: message });
  }
}

async function getBorrowers(req, res) {
  try {
    const somitiId = req.user?.somitiId || req.user?.sub;
    const result = await borrowerService.getBorrowers(somitiId);
    return res.status(200).json(result);
  } catch (err) {
    const status = err.statusCode || 500;
    const message = err.message || 'Failed to fetch borrowers';
    return res.status(status).json({ error: message });
  }
}

async function updateBorrower(req, res) {
  try {
    const { id } = req.params;
    const payload = req.body || {};

    const result = await borrowerService.updateBorrower(id, payload);

    return res.status(200).json(result);
  } catch (err) {
    const status = err.statusCode || 500;
    const message = err.message || 'Failed to update borrower';
    return res.status(status).json({ error: message });
  }
}

async function deleteBorrower(req, res) {
  try {
    const { id } = req.params;

    const result = await borrowerService.deleteBorrower(id);

    return res.status(200).json(result);
  } catch (err) {
    const status = err.statusCode || 500;
    const message = err.message || 'Failed to delete borrower';
    return res.status(status).json({ error: message });
  }
}

module.exports = {
  createBorrower,
  getBorrowers,
  updateBorrower,
  deleteBorrower,
};

