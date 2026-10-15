const installmentService = require('../services/installmentService');

async function getCollectionSheet(req, res) {
  try {
    const { somitiId } = req.params;
    const result = await installmentService.getCollectionSheet({ somitiId });
   
    return res.status(200).json(result);
  } catch (err) {
    const status = err.statusCode || 500;
    const message = err.message || 'Failed to fetch collection sheet';
    return res.status(status).json({ error: message });
  }
}


const collectInstallment = async (req, res, next) => {
  try {
    const somitiId = typeof req.params.somitiId === 'string' ? req.params.somitiId.trim() : '';
    const installmentId = typeof req.params.installmentId === 'string' ? req.params.installmentId.trim() : '';
    const { savings } = req.body ?? {};
    if (!somitiId || !installmentId) {
      return res.status(400).json({ error: 'Invalid request' });
    }
    const data = await installmentService.collect({
      somitiId,
      installmentId,
      savings
    });
    res.status(200).json({...data});
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCollectionSheet,
  collectInstallment
}