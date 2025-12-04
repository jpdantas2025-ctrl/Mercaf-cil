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

const app = express();
app.use(cors());
app.use(bodyParser.json());

// rotas
app.use('/api/auth', authRouter);
app.use('/api/markets', marketRouter);
app.use('/api/products', productRouter);
app.use('/api/drivers', driverRouter);
app.use('/api/orders', orderRouter);
app.use('/api/delivery', deliveryRouter);

// start server
const PORT = process.env.PORT || 3000;

sequelize.authenticate().then(() => {
  console.log('DB conectado com sucesso.');
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}).catch(err => {
  console.error('Falha ao conectar ao DB:', err);
});

module.exports = app;