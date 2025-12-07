
const express = require('express');
const { Review, Order, Driver, Market, User } = require('../models');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Helper to update average rating
async function updateAverageRating(targetModel, targetId) {
  const reviews = await Review.findAll({ 
    where: { 
      targetId: targetId,
      // Logic relies on consistent targetRole mapping, simplified here:
      // In production, we should filter by targetRole too.
    }
  });
  
  if (reviews.length === 0) return;

  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avg = total / reviews.length;

  const target = await targetModel.findByPk(targetId);
  if (target) {
    target.rating = parseFloat(avg.toFixed(1));
    target.totalReviews = reviews.length;
    await target.save();
  }
}

// POST /api/reviews
// Body: { orderId, rating, comment, targetRole, targetId }
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { orderId, rating, comment, targetRole, targetId } = req.body;
    const reviewerId = req.user.id;
    const reviewerRole = req.userType === 'driver' ? 'driver' : 'client';

    // Validation
    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });

    // Save Review
    const review = await Review.create({
      OrderId: orderId,
      rating,
      comment,
      reviewerRole,
      targetRole,
      targetId
    });

    // Update 'reviewed' flags on Order
    if (reviewerRole === 'client') {
        order.reviewedByClient = true;
    } else {
        order.reviewedByDriver = true;
    }
    await order.save();

    // Recalculate Averages
    if (targetRole === 'driver') {
        await updateAverageRating(Driver, targetId);
    } else if (targetRole === 'market') {
        await updateAverageRating(Market, targetId);
    }
    // Note: We don't track User rating in this MVP model, but could be added easily.

    res.status(201).json({ message: 'Avaliação enviada com sucesso', review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar avaliação' });
  }
});

module.exports = router;
