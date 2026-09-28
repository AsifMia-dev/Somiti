const { createSomiti, findSomitiByManagerId } = require('../services/somitiService');

async function create(req, res) {
  try {
    const { name, collection_day, monthly_collection_date, handValue, loan_balance } = req.body;
    const managerId = req.user?.sub;

    const result = await createSomiti({
      managerId,
      name,
      collection_day,
      monthly_collection_date,
      handValue,
      loan_balance,
    });

    return res.status(201).json(result);
  } catch (err) {
    const status = err.statusCode || 500;
    const message = err.message || 'Somiti creation failed';
    return res.status(status).json({ error: message });
  }
}

async function findSomitiByManagerIdController(req, res) {
  try {
    const managerId = req.params.managerId;
    if (!managerId || Number.isNaN(Number(managerId))) {
      const error = new Error('Manager id is required and must be a number');
      error.statusCode = 400;
      throw error;
    }

    const somiti = await findSomitiByManagerId(managerId);
    console.log(somiti);

    if (!somiti) {
      return res.status(404).json({ error: 'Somiti not found for this manager' });
    }

    return res.status(200).json({ data: somiti });
  } catch (err) {
    const status = err.statusCode || 500;
    const message = err.message || 'Failed to fetch somiti';
    return res.status(status).json({ error: message });
  }
}

module.exports = {
  create,
  findSomitiByManagerIdController,
};
