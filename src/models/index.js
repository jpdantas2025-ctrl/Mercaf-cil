const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// 1. Municípios
const Municipality = sequelize.define('Municipality', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true }
});

// 2. Supermercados
const Market = sequelize.define('Market', {
  name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING },
});

// Rel: Um Município tem vários Mercados
Municipality.hasMany(Market);
Market.belongsTo(Municipality);

// 3. Produtos
const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING },
  price: { type: DataTypes.FLOAT, allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  promoPrice: { type: DataTypes.FLOAT },
  promoUntil: { type: DataTypes.DATE },
  image: { type: DataTypes.STRING }
});

// Rel: Um Mercado tem vários Produtos
Market.hasMany(Product);
Product.belongsTo(Market);

// 4. Usuários (Clientes / Admins)
const User = sequelize.define('User', {
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  passwordHash: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: 'cliente' } // 'cliente' | 'admin'
});

// 5. Motoristas
const Driver = sequelize.define('Driver', {
  name: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING, unique: true }, // Login via telefone
  motorcyclePlate: { type: DataTypes.STRING },
  passwordHash: { type: DataTypes.STRING }, // Senha para login
  status: { type: DataTypes.ENUM('available', 'busy', 'offline', 'blocked', 'pending'), defaultValue: 'pending' }, 
  earnings: { type: DataTypes.FLOAT, defaultValue: 0.0 },
  vehicleType: {
    type: DataTypes.ENUM('motorcycle','car','bike','walking', 'on_foot'),
    allowNull: false,
    defaultValue: 'motorcycle'
  },
  points: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  level: { type: DataTypes.ENUM('bronze','prata','ouro','platina'), defaultValue: 'bronze' }
});

// 6. Pedidos
const Order = sequelize.define('Order', {
  status: { type: DataTypes.STRING, defaultValue: 'pending' }, // pending, accepted, delivered
  totalAmount: { type: DataTypes.FLOAT },
  municipality: { type: DataTypes.STRING },
  driverCommission: { type: DataTypes.FLOAT },
  platformCommission: { type: DataTypes.FLOAT },
  marketValue: { type: DataTypes.FLOAT }
});

// 7. Itens do Pedido (Relacionamento N:N entre Pedido e Produto com quantidade)
const OrderItem = sequelize.define('OrderItem', {
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  price: { type: DataTypes.FLOAT } // Preço no momento da compra
});

// 8. Repasses (Payouts)
const Payout = sequelize.define('Payout', {
  amountDriver: { type: DataTypes.FLOAT },
  amountMarket: { type: DataTypes.FLOAT },
  platformFee: { type: DataTypes.FLOAT },
  status: { type: DataTypes.STRING, defaultValue: 'pending' } // pending, paid
});

// 9. Entregas (Logística)
const Delivery = sequelize.define('Delivery', {
  distanceKm: { type: DataTypes.FLOAT, allowNull: false },
  vehicleType: {
    type: DataTypes.ENUM('motorcycle','car','bike','walking', 'on_foot'),
    allowNull: false
  },
  estimatedTimeMin: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('pending','on_route','completed'), defaultValue: 'pending' }
});

// Relacionamentos de Pedido
User.hasMany(Order, { foreignKey: 'customerId', as: 'customer' });
Order.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });

Driver.hasMany(Order, { foreignKey: 'driverId', as: 'driver' });
Order.belongsTo(Driver, { foreignKey: 'driverId', as: 'driver' });

Market.hasMany(Order);
Order.belongsTo(Market);

// Order Items
Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);
Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

// Payouts
Order.hasOne(Payout);
Payout.belongsTo(Order);

Driver.hasMany(Payout);
Payout.belongsTo(Driver);

// Entregas
Order.hasOne(Delivery);
Delivery.belongsTo(Order);
Driver.hasMany(Delivery);
Delivery.belongsTo(Driver);

module.exports = {
  sequelize,
  Municipality,
  Market,
  Product,
  User,
  Driver,
  Order,
  OrderItem,
  Payout,
  Delivery
};