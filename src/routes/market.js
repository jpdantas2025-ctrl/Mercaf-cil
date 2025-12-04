// src/routes/market.js
const express = require('express');
const { Market, Municipality } = require('../models');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// listar todos mercados — público
router.get('/', async (req, res) => {
  try {
    const markets = await Market.findAll({ include: Municipality });
    res.json(markets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar mercados' });
  }
});

// criar mercado — PÚBLICO (Para permitir cadastro de parceiros via site/app)
// Em produção, isso poderia criar um registro com status 'pending'
router.post('/', async (req, res) => {
  try {
    const { name, address, municipalityId } = req.body;
    
    if (!name || !address || !municipalityId) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const mun = await Municipality.findByPk(municipalityId);
    if (!mun) return res.status(400).json({ error: 'Município inválido' });
    
    const m = await Market.create({ name, address, MunicipalityId: municipalityId });
    res.status(201).json(m);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar mercado' });
  }
});

// atualizar mercado - Protegido (Admin)
router.put('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, municipalityId } = req.body;
    const m = await Market.findByPk(id);
    if (!m) return res.status(404).json({ error: 'Mercado não encontrado' });
    
    if (municipalityId) {
        const mun = await Municipality.findByPk(municipalityId);
        if (!mun) return res.status(400).json({ error: 'Município inválido' });
        m.MunicipalityId = municipalityId;
    }
    
    m.name = name || m.name;
    m.address = address || m.address;
    
    await m.save();
    res.json(m);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar mercado' });
  }
});

// deletar mercado - Protegido (Admin)
router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const m = await Market.findByPk(id);
    if (!m) return res.status(404).json({ error: 'Mercado não encontrado' });
    await m.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar mercado' });
  }
});

module.exports = router;