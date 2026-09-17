const { registerUser, loginUser } = require('../services/authService');

async function register(req, res) {
   try {
  const { name, email, password, phone } = req.body;
  const result = await registerUser({ name, email, password, phone });
     return res.status(201).json(result);
   } catch (err) {
     const status = err.statusCode || 500;
     const message = err.message || 'Registration failed';
     return res.status(status).json({ error: message });
   }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const result = await loginUser({ email, password });
    return res.status(200).json(result);
  } catch (err) {
    const status = err.statusCode || 500;
    const message = err.message || 'Login failed';
    return res.status(status).json({ error: message });
  }
}

module.exports = { register, login };
