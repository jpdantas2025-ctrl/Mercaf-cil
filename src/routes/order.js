// src/routes/order.js
const express = require('express');
const { Order, OrderItem, Product, Market } = require('../models');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// criar pedido — cliente logado
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items, marketId } = req.body;
    // calcula total
    let total = 0;
    for (const it of items) {
      const prod = await Product.findByPk(it.productId);
      if (!prod) return res.status(400).json({ error: 'Produto inválido' });
      total += prod.price * it.quantity;
    }
    const order = await Order.create({
      customerId: req.user.id,
      MarketId: marketId,
      status: 'pending',
      totalAmount: total
    });
    const orderItems = await Promise.all(items.map(it => {
      return OrderItem.create({
        OrderId: order.id,
        ProductId: it.productId,
        quantity: it.quantity,
        price: it.price || 0
      });
    }));
    res.json({ orderId: order.id, items: orderItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
});

// listar pedidos do cliente
router.get('/myorders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { customerId: req.user.id }, include: ['driver', 'customer'] });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

// listar pedidos pendentes (disponíveis para motoristas)
router.get('/pending', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.findAll({ 
      where: { status: 'pending' },
      include: [
        { model: Market, attributes: ['name', 'address'] }
      ] 
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar pedidos pendentes' });
  }
});

module.exports = router;