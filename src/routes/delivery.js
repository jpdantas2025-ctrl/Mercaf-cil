const express = require('express');
const { Order, Driver, Payout } = require('../models');
const router = express.Router();

// atribuir motorista a pedido
router.post('/:orderId/assign', async (req, res) => {
  try {
    const { driverId } = req.body;
    const order = await Order.findByPk(req.params.orderId);
    const driver = await Driver.findByPk(driverId);
    if (!order || !driver) return res.status(404).json({ error: 'Pedido ou motorista não encontrado' });
    if (driver.status !== 'available') return res.status(400).json({ error: 'Motorista não disponível' });

    order.driverId = driverId;
    order.status = 'assigned';
    await order.save();

    driver.status = 'busy';
    await driver.save();

    res.json({ message: 'Motorista atribuído', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atribuir motorista' });
  }
});

// marcar como entregue e gerar repasse
router.post('/:orderId/complete', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.orderId);
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
    if (!['assigned','in_transit'].includes(order.status)) return res.status(400).json({ error: 'Pedido não está em rota' });

    order.status = 'delivered';
    await order.save();

    const total = order.totalAmount;
    const driverShare = total * 0.10;   // 10% motorista
    const platformFee = total * 0.10;   // 10% plataforma
    const marketShare = total - driverShare - platformFee;

    const payout = await Payout.create({
      OrderId: order.id,
      driverId: order.driverId,
      amountDriver: driverShare,
      amountMarket: marketShare,
      platformFee: platformFee,
      status: 'pending'
    });

    // liberar motorista
    if (order.driverId) {
        const driver = await Driver.findByPk(order.driverId);
        if (driver) {
            driver.status = 'available';
            // update earnings simplified
            driver.earnings = (driver.earnings || 0) + driverShare;
            await driver.save();
        }
    }

    res.json({ message: 'Pedido entregue, repasse criado', payout });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao completar pedido' });
  }
});

// histórico de repasses para motorista
router.get('/payouts/driver/:driverId', async (req, res) => {
  try {
    const payouts = await Payout.findAll({ where: { driverId: req.params.driverId } });
    res.json(payouts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar repasses' });
  }
});

module.exports = router;