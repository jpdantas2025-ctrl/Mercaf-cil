const express = require('express');
const { Driver } = require('../models');
const { authMiddleware, requireRole } = require('../middleware/auth');
const router = express.Router();

// registrar novo motorista-entregador (Público ou Admin)
router.post('/register', async (req, res) => {
  try {
    const { name, motorcyclePlate, phone, vehicleType } = req.body;
    // Default status is now 'pending' for approval workflow
    const driver = await Driver.create({ 
        name, 
        motorcyclePlate, 
        phone, 
        status: 'pending', 
        vehicleType: vehicleType || 'motorcycle' // default
    });
    res.status(201).json(driver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// listar motoristas disponíveis (Para atribuição de pedidos)
router.get('/available', async (req, res) => {
  try {
    const drivers = await Driver.findAll({ where: { status: 'available' } });
    res.json(drivers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar motoristas' });
  }
});

// ADMIN: Listar TODOS os motoristas
router.get('/', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const drivers = await Driver.findAll();
    res.json(drivers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar lista de motoristas' });
  }
});

// ADMIN: Atualizar status do motorista (Aprovar / Bloquear)
router.put('/:id/status', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // expected: 'available', 'blocked', 'pending'

    const driver = await Driver.findByPk(id);
    if (!driver) return res.status(404).json({ error: 'Motorista não encontrado' });

    driver.status = status;
    await driver.save();
    
    res.json(driver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
});

// Rota de Ranking (Leaderboard)
router.get('/rank', async (req, res) => {
    try {
        const drivers = await Driver.findAll({
            order: [['points', 'DESC']],
            limit: 10,
            attributes: ['id', 'name', 'points', 'level', 'municipality', 'vehicleType']
        });
        res.json(drivers);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar ranking' });
    }
});

module.exports = router;