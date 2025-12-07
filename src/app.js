
require('dotenv').config(); // Load environment variables first
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/db');

const authRouter = require('./routes/auth');
const marketRouter = require('./routes/market');
const productRouter = require('./routes/product');
const driverRouter = require('./routes/driver');
const orderRouter = require('./routes/order');
const deliveryRouter = require('./routes/delivery');
const reviewRouter = require('./routes/review'); 
const bankingRouter = require('./routes/banking'); // New Banking Router

const app = express();

// CORS Configuration
// In production, you might want to restrict this to your frontend domain
app.use(cors());

app.use(bodyParser.json());

// Health Check Route (Important for Railway/Render/AWS)
app.get('/', (req, res) => {
  res.status(200).send('Mercafácil API is running 🚀');
});

// rotas
app.use('/api/auth', authRouter);
app.use('/api/markets', marketRouter);
app.use('/api/products', productRouter);
app.use('/api/drivers', driverRouter);
app.use('/api/orders', orderRouter);
app.use('/api/delivery', deliveryRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/banking', bankingRouter); // Register Banking

// start server
const PORT = process.env.PORT || 3000;

sequelize.authenticate().then(() => {
  console.log('DB conectado com sucesso.');
  // Sync database (use {force: true} only in dev to reset tables)
  // await sequelize.sync(); 
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}).catch(err => {
  console.error('Falha ao conectar ao DB:', err);
});

module.exports = app;
