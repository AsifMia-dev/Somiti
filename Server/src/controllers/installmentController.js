const installmentService = require('../services/installmentService');

async function getCurrentWeekInstallments(req, res) {
  try {
    const { somitiId } = req.params;

    const result = await installmentService.getCurrentWeekInstallments({ somitiId });

    return res.status(200).json(result);
  } catch (err) {
    const status = err.statusCode || 500;
    const message = err.message || 'Failed to fetch current week installments';
    return res.status(status).json({ error: message });
  }
}