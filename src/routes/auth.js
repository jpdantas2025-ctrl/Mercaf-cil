
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Driver, Role } = require('../models');
require('dotenv').config();

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const SECRET_KEY = JWT_SECRET || 'dev_fallback_secret_do_not_use_in_prod';

// --------------------------------------------------------------------------
// REGISTRO DE CLIENTE (Genérico)
// --------------------------------------------------------------------------
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if email already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email já em uso' });

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Assign role 'cliente'
    const clientRole = await Role.findOne({ where: { name: 'cliente' } });
    
    const user = await User.create({ 
        name, 
        email, 
        passwordHash, 
        role: 'cliente',
        RoleId: clientRole ? clientRole.id : null 
    });
    
    res.json({ message: 'Cadastrado com sucesso', user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// --------------------------------------------------------------------------
// LOGIN UNIFICADO (Cliente, Admin, Motorista)
// --------------------------------------------------------------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body; // 'email' field can accept phone for drivers
    let user = null;
    let roleName = 'cliente';
    let userType = 'user';

    // 1. Tenta encontrar na tabela User (Cliente/Admin) por email
    user = await User.findOne({ 
        where: { email },
        include: [Role]
    });

    if (user) {
        // Usuário encontrado na tabela User
        roleName = user.Role ? user.Role.name : (user.role || 'cliente');
    } else {
        // 2. Se não achou, tenta na tabela Driver (Motorista) pelo telefone (campo email no body)
        // Incluindo Role para garantir acesso
        user = await Driver.findOne({ 
            where: { phone: email },
            include: [Role]
        }); 
        
        if (user) {
            roleName = user.Role ? user.Role.name : 'entregador';
            userType = 'driver';
        }
    }

    if (!user) return res.status(400).json({ error: 'Credenciais inválidas' });

    // 3. Verificar Senha
    // Nota: Em produção, drivers também devem ter senha hash. Para MVP, se não tiver hash, verificar se bate texto plano ou regra específica.
    // Aqui assumimos que todos usam bcrypt.
    if (!user.passwordHash) {
         // Fallback para drivers criados sem senha no MVP (apenas para teste, remover em prod)
         // Permitir login se a senha enviada for igual ao telefone (comportamento de teste)
         if (password !== email) return res.status(400).json({ error: 'Senha não configurada.' });
    } else {
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return res.status(400).json({ error: 'Credenciais inválidas' });
    }

    // 4. Gerar Token
    const token = jwt.sign(
        { userId: user.id, role: roleName, type: userType }, 
        SECRET_KEY, 
        { expiresIn: '7d' }
    );

    res.json({ 
        token, 
        user: { 
            id: user.id, 
            name: user.name, 
            role: roleName,
            email: user.email || user.phone // Driver might not have email
        } 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

module.exports = router;
