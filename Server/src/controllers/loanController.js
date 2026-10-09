const loanService = require('../services/loanService');

async function createLoan(req, res) {
  const { somitiId } = req.params;
  try {
    const {
      loan_type,
      loan_amount,
      interest_rate,
      total_installment,
      installment_amount,
      savings,
      frequency,
      borrower_id,
    } = req.body;

    const result = await loanService.createNewLoan({
      somitiId,
      loan_type,
      loan_amount,
      interest_rate,
      total_installment,
      installment_amount,
      savings,
      frequency,
      borrower_id,
    });

    return res.status(201).json(result);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Loan creation failed';
    return res.status(statusCode).json({ error: message });
  }
}

async function getLoans(req, res) {
  const { somitiId } = req.params;
  try {
    const result = await loanService.getAllLoans(somitiId);
    return res.status(200).json(result);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Failed to fetch loans';
    return res.status(statusCode).json({ error: message });
  }
}

module.exports = {
  createLoan,
  getLoans,
};
