const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return res.status(401).json({ error: 'Missing token' });
  const token = match[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { sub, email, iat, exp }
    // Debug logging only when DEBUG env set
    if (process.env.DEBUG) console.debug('auth payload set for user id', payload.sub);
    next();
  } catch (err) {
    console.error('JWT verify error:', err && err.message ? err.message : err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
