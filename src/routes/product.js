
// src/routes/product.js
const express = require('express');
const { Product, Market } = require('../models'); // Added Market import
const { Op } = require('sequelize');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// criar produto — ADMIN
router.post('/', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { name, category, price, stock, marketId, promoPrice, promoUntil } = req.body;
    const p = await Product.create({ name, category, price, stock, MarketId: marketId, promoPrice, promoUntil });
    res.status(201).json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

// atualizar produto — ADMIN
router.put('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, stock, promoPrice, promoUntil } = req.body;
    const p = await Product.findByPk(id);
    if (!p) return res.status(404).json({ error: 'Produto não encontrado' });
    p.name = name;
    p.category = category;
    p.price = price;
    p.stock = stock;
    p.promoPrice = promoPrice;
    p.promoUntil = promoUntil;
    await p.save();
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

// deletar produto — ADMIN
router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const p = await Product.findByPk(id);
    if (!p) return res.status(404).json({ error: 'Produto não encontrado' });
    await p.destroy();
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
});

// listar todos produtos de um mercado — público
router.get('/market/:marketId', async (req, res) => {
  try {
    const prods = await Product.findAll({ where: { MarketId: req.params.marketId } });
    res.json(prods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar produtos do mercado' });
  }
});

// rota: produtos mais baratos do dia (por preço normal ou promo se houver)
/** Retorna top 10 ordenados pelo menor preço vigente (promoPrice se ativa, senão price) */
router.get('/cheapest-today', async (req, res) => {
  try {
    const now = new Date();
    const prods = await Product.findAll({
      // Fixed: Removed restrictive 'where' clause that filtered out products with expired promotions completely.
      // Now we fetch all, calculate effective price, and sort.
      include: [Market] 
    });
    // map para preço real e ordenar
    const list = prods.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      effectivePrice: (p.promoPrice && p.promoUntil >= now) ? p.promoPrice : p.price,
      price: p.price, // Send original price
      stock: p.stock,
      MarketId: p.MarketId,
      image: p.image,
      Market: p.Market // Include full market object
    }));
    list.sort((a, b) => a.effectivePrice - b.effectivePrice);
    res.json(list.slice(0, 10));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar produtos mais baratos' });
  }
});

// rota: promoções ativas — público para usuários logados
router.get('/promocoes', authMiddleware, async (req, res) => {
  try {
    const now = new Date();
    const prods = await Product.findAll({
      where: {
        promoPrice: { [Op.not]: null },
        promoUntil: { [Op.gte]: now }
      },
      include: [Market]
    });
    res.json(prods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar promoções' });
  }
});

module.exports = router;
