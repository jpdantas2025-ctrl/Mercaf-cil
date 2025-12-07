
const express = require('express');
const { Order, Driver, Transaction } = require('../models');
const BankingService = require('../services/bankingService');
const router = express.Router();

// atribuir motorista a pedido
router.post('/:orderId/assign', async (req, res) => {
  try {
    const { driverId } = req.body;
    const order = await Order.findByPk(req.params.orderId);
    const driver = await Driver.findByPk(driverId);
    if (!order || !driver) return res.status(404).json({ error: 'Pedido ou motorista não encontrado' });
    if (driver.status !== 'available') return res.status(400).json({ error: 'Motorista não disponível' });

    order.DriverId = driverId;
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

// marcar como entregue e gerar repasse (BANKING INTEGRATION)
router.post('/:orderId/complete', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.orderId);
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
    
    // Check status logic simplified for demo
    // if (!['assigned','delivering'].includes(order.status)) return res.status(400).json({ error: 'Pedido não está em rota' });

    order.status = 'delivered';
    await order.save();

    // 1. Simular Pagamento se não existir (Para o fluxo de demo funcionar sem gateway real)
    let transaction = await Transaction.findOne({ where: { OrderId: order.id } });
    if (!transaction) {
        transaction = await BankingService.createTransaction(order.id, order.CustomerId, order.totalAmount, 'pix');
    }

    // 2. Executar o Split Bancário (80/10/10 + Cashback)
    const payout = await BankingService.processOrderSplit(order, transaction);

    // 3. Liberar motorista
    if (order.DriverId) {
        const driver = await Driver.findByPk(order.DriverId);
        if (driver) {
            driver.status = 'available';
            await driver.save();
        }
    }

    res.json({ message: 'Pedido entregue, repasses processados com sucesso.', payout });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao completar pedido' });
  }
});

// histórico de entregas do motorista
router.get('/driver/:driverId/history', async (req, res) => {
  try {
    const deliveries = await Order.findAll({ 
        where: { DriverId: req.params.driverId },
        order: [['createdAt', 'DESC']] 
    });
    
    // Get updated driver stats
    const driver = await Driver.findByPk(req.params.driverId);
    
    res.json({ deliveries, driver });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
});

module.exports = router;
