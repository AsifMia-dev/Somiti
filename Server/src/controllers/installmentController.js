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
    const somitiId = Number(req.params.somitiId);
    const installmentId = Number(req.params.installmentId);
    if (!Number.isInteger(somitiId) || !Number.isInteger(installmentId)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const data = await installmentService.collect({
      somitiId,
      installmentId,
    });

    res.status(200).json({ message: 'কিস্তি আদায় হয়েছে', data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCollectionSheet,
  collectInstallment
}