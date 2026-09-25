const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { JWT_SECRET } = require('../config/env');


function generateAccessToken(payload, expiresIn = '1h') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}


async function registerUser({ email, password, name, phone }) {
  if (!name || !email || !password || !phone) {
    const error = new Error('All field required');
    error.statusCode = 400;
    throw error;
  }

  const existing = await prisma.manager.findUnique({ where: { email } });
  if (existing) {
    const error = new Error('User already exists');
    error.statusCode = 409;
    throw error;
  }

  const password_hash = await bcrypt.hash(password, 11);


  const user = await prisma.manager.create({
    data: {
      name,
      email,
      password_hash,
      phone,
    },
  });

  const token = generateAccessToken({ sub: user.id, name: user.name, email: user.email });

  return {
    message: "Account created successfully",  
    "data": {
      "accessToken": token
    }
  };
}

async function loginUser({ email, password }) {
  if (!email || !password) {
    const error = new Error('email and password required');
    error.statusCode = 400;
    throw error;
  }

  const user = await prisma.manager.findUnique({ where: { email } });
  if (!user || !user.password_hash) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const token = generateAccessToken({ sub: user.id, email: user.email });

  return{
    "message": "Login successful",
    "data": {
      "accessToken": token
    }
  }
}

module.exports = {
  registerUser,
  loginUser
};
