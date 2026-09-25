const { createSomiti } = require('../services/somitiService');

async function create(req, res) {
  try {
    const { name,collection_day,monthly_collection_date, netValue, handValue, loan_balance } = req.body;
    const managerId = req.user?.sub;

    const result = await createSomiti({
      managerId,
      name,
      collection_day,
      monthly_collection_date,
      netValue,
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

module.exports = {
  create,
};
