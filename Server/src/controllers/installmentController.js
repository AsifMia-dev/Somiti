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

module.exports = {
  getCollectionSheet
}