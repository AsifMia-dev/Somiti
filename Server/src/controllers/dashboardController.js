const dashboardService = require('../services/dashboardService');

async function balanceSummary(req, res) {
  try {
    const somitiId = Number(req.params.somitiId);
    if (!somitiId || Number.isNaN(somitiId)) {
      const error = new Error('Invalid somiti id');
      error.statusCode = 400;
      throw error;
    }

    const summary = await dashboardService.getBalanceSummary(somitiId);

    return res.status(200).json({ data: summary });
  } catch (err) {
    const status = err.statusCode || 500;
    const message = err.message || 'Failed to fetch balance summary';
    return res.status(status).json({ error: message });
  }
}

module.exports = {
  balanceSummary,
};
