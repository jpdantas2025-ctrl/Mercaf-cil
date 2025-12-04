// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { User, Driver } = require('../models');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'troque_para_uma_chave_secreta_forte';

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Token inválido' });

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ error: 'Token mal formatado' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // identifica se é user ou driver
    let user = await User.findByPk(payload.userId);
    if (!user) {
      user = await Driver.findByPk(payload.userId);
      if (!user) return res.status(401).json({ error: 'Usuário inválido' });
      req.user = user;
      req.userType = 'driver';
    } else {
      req.user = user;
      req.userType = 'user';
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Não autorizado' });
    if (req.user.role !== role) return res.status(403).json({ error: 'Permissão negada' });
    next();
  };
}

module.exports = { authMiddleware, requireRole };