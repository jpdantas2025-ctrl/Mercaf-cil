
const jwt = require('jsonwebtoken');
const { User, Driver, Role, Permission } = require('../models');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// SECURITY AUDIT FIX:
// In production, the app should fail fast if no secret is provided.
if (process.env.NODE_ENV === 'production' && !JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
  process.exit(1);
}

const SECRET_KEY = JWT_SECRET || 'dev_fallback_secret_do_not_use_in_prod';

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Token inválido' });

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ error: 'Token mal formatado' });

  try {
    const payload = jwt.verify(token, SECRET_KEY);
    
    // Tenta carregar User com Role e Permissões
    let user = await User.findByPk(payload.userId, {
      include: {
        model: Role,
        include: [Permission]
      }
    });

    if (!user) {
      // Tenta Driver, também incluindo Role e Permissões
      user = await Driver.findByPk(payload.userId, {
        include: {
          model: Role,
          include: [Permission]
        }
      });
      
      if (!user) return res.status(401).json({ error: 'Usuário inválido' });
      
      req.user = user;
      req.userType = 'driver';
    } else {
      req.user = user;
      req.userType = 'user';
    }
    
    next();
  } catch (err) {
    console.error('Auth Error:', err.message);
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

// Verifica se o usuário tem a role específica (ex: 'admin')
function requireRole(roleName) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Não autorizado' });
    
    // Compatibilidade: Checa string simples 'role' (legado) ou Objeto Role (novo)
    const userRole = req.user.Role ? req.user.Role.name : req.user.role;
    
    if (userRole !== roleName) {
      return res.status(403).json({ error: 'Permissão negada' });
    }
    next();
  };
}

// Verifica se o usuário tem uma permissão específica (RBAC real)
function requirePermission(permName) {
  return (req, res, next) => {
    if (!req.user || !req.user.Role || !req.user.Role.Permissions) {
        // Se não tiver estrutura de roles carregada, nega por segurança
        return res.status(403).json({ error: 'Acesso negado: Perfil sem permissões definidas' });
    }

    const hasPerm = req.user.Role.Permissions.some(p => p.name === permName);
    if (!hasPerm) return res.status(403).json({ error: `Requer permissão: ${permName}` });
    
    next();
  };
}

module.exports = { authMiddleware, requireRole, requirePermission };
