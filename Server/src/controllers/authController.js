const Joi = require('joi');
const { registerUser, loginUser } = require('../services/authService');

const registerSchema = Joi.object({
  name: Joi.string().min(1).pattern(/[A-Za-z]/).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: true } }).required(),
  password: Joi.string().min(6).pattern(/(?=.*[0-9])(?=.*[A-Za-z])/).required(),
  phone: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: true } }).required(),
  password: Joi.string().min(6).required(),
});

function mapValidationError(err) {
  if (!err || !err.details || !err.details.length) return null;
  const detail = err.details[0];
  const key = detail.context && detail.context.key;
  const type = detail.type;
  if (key === 'email' || type === 'string.email') return 'Incorrect email';
  if (key === 'password') return 'Password must be at least 6 characters and include letters and numbers';
  if (key === 'name') return 'Name must include letters and cannot be only numbers';
  if (key === 'phone') return 'Phone is required';
  return err.details[0].message;
}

async function register(req, res) {
   try {
  // Ensure required fields are present
  const required = ['name', 'email', 'password', 'phone'];
  const missing = required.some((k) => req.body[k] === undefined || req.body[k] === null || req.body[k] === '');
  if (missing) {
    const err = new Error('All field required');
    err.statusCode = 400;
    throw err;
  }

  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    const msg = mapValidationError(error) || error.details[0].message;
    const err = new Error(msg);
    err.statusCode = 400;
    throw err;
  }

  const { name, email, password, phone } = value;
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
    // Ensure required fields are present
    const missing = ['email', 'password'].some((k) => req.body[k] === undefined || req.body[k] === null || req.body[k] === '');
    if (missing) {
      const err = new Error('All field required');
      err.statusCode = 400;
      throw err;
    }

    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      const msg = mapValidationError(error) || error.details[0].message;
      const err = new Error(msg);
      err.statusCode = 400;
      throw err;
    }

    const result = await loginUser({ email: value.email, password: value.password });
    return res.status(200).json(result);
  } catch (err) {
    const status = err.statusCode || 500;
    const message = err.message || 'Login failed';
    return res.status(status).json({ error: message });
  }
}

module.exports = { register, login };
