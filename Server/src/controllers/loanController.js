const loanService = require('../services/loanService');

async function createLoan(req, res) {
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
  try {
    const result = await loanService.getAllLoans();
    return res.status(200).json(result);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Failed to fetch loans';
    return res.status(statusCode).json({ error: message });
  }
}

async function getLoansByBorrower(req,res){
  try {
    const borrowerId = req.query.borrowerId || req.params.borrowerId;
    const result = await loanService.getLoansByBorrower({ borrowerId });
    return res.status(200).json(result);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Failed to fetch loans';
    return res.status(statusCode).json({ error: message });
  }
}

async function getLoanById(req, res) {
  try {
    const { id } = req.params;
    const result = await loanService.getLoanById(id);
    return res.status(200).json(result);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Failed to fetch loan';
    return res.status(statusCode).json({ error: message });
  }
}

async function updateLoan(req, res) {
  try {
    const { id } = req.params;
    const payload = req.body || {};

    const result = await loanService.updateLoan(id, payload);
    return res.status(200).json(result);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Failed to update loan';
    return res.status(statusCode).json({ error: message });
  }
}

async function deleteLoan(req, res) {
  try {
    const { id } = req.params;
    const result = await loanService.deleteLoan(id);
    return res.status(200).json(result);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Failed to delete loan';
    return res.status(statusCode).json({ error: message });
  }
}

module.exports = {
  createLoan,
  getLoans,
  getLoansByBorrower,
  getLoanById,
  updateLoan,
  deleteLoan,
};
