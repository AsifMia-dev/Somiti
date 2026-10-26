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
      completed_installment,
      loan_provided_date,
      total_fine_collected,
    } = req.body;

    console.log("completed installment",completed_installment);

    const result = await loanService.createLoan({
      somitiId,
      loan_type,
      loan_amount,
      interest_rate,
      total_installment,
      installment_amount,
      savings,
      frequency,
      borrower_id,
      completed_installment,
      loan_provided_date,
      total_fine_collected
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
