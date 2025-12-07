
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * ==========================================================
 * 1. SISTEMA CENTRAL & LOCALIZAÇÃO
 * ==========================================================
 */

// Municípios de Roraima (Tabela de Domínio)
const Municipality = sequelize.define('Municipality', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  state: { type: DataTypes.STRING, defaultValue: 'RR' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});

// Roles e Permissões (RBAC)
const Role = sequelize.define('Role', {
  name: { type: DataTypes.STRING, unique: true, allowNull: false }, // 'admin', 'customer', 'driver', 'vendor'
  description: { type: DataTypes.STRING }
});

const Permission = sequelize.define('Permission', {
  name: { type: DataTypes.STRING, unique: true, allowNull: false }, // 'product:create', 'report:view'
  description: { type: DataTypes.STRING }
});

const RolePermission = sequelize.define('RolePermission', {});
Role.belongsToMany(Permission, { through: RolePermission });
Permission.belongsToMany(Role, { through: RolePermission });

/**
 * ==========================================================
 * 2. AUTENTICAÇÃO E PERFIS DE USUÁRIO
 * ==========================================================
 */

// Tabela Base de Usuários (Login Unificado)
const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: true }, // Drivers podem usar apenas telefone
  phone: { type: DataTypes.STRING, unique: true, allowNull: false },
  passwordHash: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING, allowNull: false },
  avatarUrl: { type: DataTypes.STRING },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  lastLogin: { type: DataTypes.DATE }
});

User.belongsTo(Role);
Role.hasMany(User);

// Perfil: Cliente (Consumidor)
const Customer = sequelize.define('Customer', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  cpf: { type: DataTypes.STRING, unique: true },
  addressDefault: { type: DataTypes.JSONB }, // { street, number, coords: { lat, lng } }
  
  // Gamificação
  points: { type: DataTypes.INTEGER, defaultValue: 0 },
  level: { type: DataTypes.ENUM('Bronze', 'Prata', 'Ouro', 'Platina'), defaultValue: 'Bronze' },
  xp: { type: DataTypes.INTEGER, defaultValue: 0 },
  streakDays: { type: DataTypes.INTEGER, defaultValue: 0 },
  lifetimeSavings: { type: DataTypes.FLOAT, defaultValue: 0.0 }
});

Customer.belongsTo(User); // 1:1 Link
User.hasOne(Customer);

// Perfil: Motorista / Entregador
const Driver = sequelize.define('Driver', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  cpf: { type: DataTypes.STRING, unique: true },
  cnh: { type: DataTypes.STRING },
  vehicleType: { 
    type: DataTypes.ENUM('motorcycle', 'car', 'bike', 'walking', 'on_foot'),
    allowNull: false 
  },
  vehiclePlate: { type: DataTypes.STRING },
  status: { 
    type: DataTypes.ENUM('pending', 'available', 'busy', 'offline', 'blocked'), 
    defaultValue: 'pending' 
  },
  
  // Métricas
  rating: { type: DataTypes.FLOAT, defaultValue: 5.0 },
  totalDeliveries: { type: DataTypes.INTEGER, defaultValue: 0 },
  
  // Documentação e Aprovação
  documentsUrl: { type: DataTypes.JSONB }, // { cnh_front: url, selfie: url }
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  
  // Financeiro Dedicado (Driver Earnings)
  totalEarned: { type: DataTypes.FLOAT, defaultValue: 0.00 },
  withdrawnAmount: { type: DataTypes.FLOAT, defaultValue: 0.00 },
  availableAmount: { type: DataTypes.FLOAT, defaultValue: 0.00 },
  lastPayoutUpdate: { type: DataTypes.DATE }
});

Driver.belongsTo(User); // 1:1 Link
User.hasOne(Driver);
Driver.belongsTo(Municipality); // Cidade Base

// Perfil: Lojista / Mercado (Vendor)
const Vendor = sequelize.define('Vendor', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  businessName: { type: DataTypes.STRING, allowNull: false }, // Razão Social
  tradeName: { type: DataTypes.STRING, allowNull: false }, // Nome Fantasia
  cnpj: { type: DataTypes.STRING, unique: true },
  address: { type: DataTypes.STRING },
  location: { type: DataTypes.JSONB }, // { lat, lng }
  
  // Configurações
  isOpen: { type: DataTypes.BOOLEAN, defaultValue: false },
  deliveryType: { type: DataTypes.ENUM('platform', 'own', 'hybrid'), defaultValue: 'platform' },
  
  // Métricas
  rating: { type: DataTypes.FLOAT, defaultValue: 5.0 },
  engagementScore: { type: DataTypes.INTEGER, defaultValue: 100 },

  // Financeiro Dedicado
  availableBalance: { type: DataTypes.FLOAT, defaultValue: 0.00 }
});

Vendor.belongsTo(User); // Dono da loja
User.hasMany(Vendor); // Um usuário pode ter múltiplos mercados (franquia)
Vendor.belongsTo(Municipality);

/**
 * ==========================================================
 * 3. CATÁLOGO E PRODUTOS (COM IA)
 * ==========================================================
 */

const Category = sequelize.define('Category', {
  name: { type: DataTypes.STRING, allowNull: false },
  icon: { type: DataTypes.STRING }, // Lucide icon name
  isAdult: { type: DataTypes.BOOLEAN, defaultValue: false }
});

const Product = sequelize.define('Product', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.FLOAT, allowNull: false },
  originalPrice: { type: DataTypes.FLOAT }, // Para "de/por"
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  image: { type: DataTypes.STRING },
  
  // Promoções
  promoPrice: { type: DataTypes.FLOAT },
  promoExpiresAt: { type: DataTypes.DATE },
  isFlashOffer: { type: DataTypes.BOOLEAN, defaultValue: false },
  
  // IA & Metadados
  aiTags: { type: DataTypes.JSONB }, // Tags geradas pela IA
  nutritionalInfo: { type: DataTypes.JSONB }, // Para Modo Saudável
  isHealthy: { type: DataTypes.BOOLEAN, defaultValue: false }
});

Product.belongsTo(Vendor);
Vendor.hasMany(Product);
Product.belongsTo(Category);

/**
 * ==========================================================
 * 4. PEDIDOS E LOGÍSTICA
 * ==========================================================
 */

const Order = sequelize.define('Order', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  status: { 
    type: DataTypes.ENUM('pending', 'accepted', 'preparation', 'ready', 'assigned', 'delivering', 'delivered', 'cancelled', 'returned'),
    defaultValue: 'pending' 
  },
  
  // Valores
  subtotal: { type: DataTypes.FLOAT, allowNull: false },
  deliveryFee: { type: DataTypes.FLOAT, defaultValue: 0 },
  discount: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
  
  // Logística
  distanceKm: { type: DataTypes.FLOAT },
  estimatedTimeMin: { type: DataTypes.INTEGER },
  deliveryAddress: { type: DataTypes.JSONB },
  deliveryType: { type: DataTypes.ENUM('standard', 'express', 'scheduled'), defaultValue: 'standard' },
  
  // Preferências
  substitutionPreference: { 
    type: DataTypes.ENUM('substitute', 'refund', 'contact'), 
    defaultValue: 'substitute' 
  },
  
  // Códigos
  confirmationCode: { type: DataTypes.STRING(4) }, // Para entregar
  
  // Flags
  reviewedByClient: { type: DataTypes.BOOLEAN, defaultValue: false },
  reviewedByDriver: { type: DataTypes.BOOLEAN, defaultValue: false }
});

const OrderItem = sequelize.define('OrderItem', {
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  priceAtPurchase: { type: DataTypes.FLOAT, allowNull: false }, // Preço congelado no momento da compra
  notes: { type: DataTypes.STRING }
});

Order.belongsTo(Customer);
Customer.hasMany(Order);

Order.belongsTo(Vendor); // Alias Market
Vendor.hasMany(Order);

Order.belongsTo(Driver); // Driver pode ser nulo inicialmente
Driver.hasMany(Order);

OrderItem.belongsTo(Order);
Order.hasMany(OrderItem);

OrderItem.belongsTo(Product);

/**
 * ==========================================================
 * 5. SISTEMA BANCÁRIO DO MERCAFÁCIL (ATUALIZADO)
 * ==========================================================
 */

// 5.1 Transactions (Entrada de dinheiro dos Clientes)
const Transaction = sequelize.define('Transaction', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  paymentMethod: { type: DataTypes.ENUM('pix', 'card'), allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'confirmed', 'failed', 'refunded'), defaultValue: 'pending' },
  transactionDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

Transaction.belongsTo(Order);
Order.hasOne(Transaction);
Transaction.belongsTo(Customer);

// 5.2 Wallet (Carteira Unificada para Customer, Driver, Vendor)
// Usamos uma tabela para permitir flexibilidade, mas no Customer temos 'balance' direto.
// Vamos focar no Wallet para o histórico e para Vendor/Driver consolidado.
const Wallet = sequelize.define('Wallet', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  ownerType: { type: DataTypes.ENUM('customer', 'driver', 'vendor'), allowNull: false },
  ownerId: { type: DataTypes.UUID, allowNull: false }, // ID do Customer, Driver ou Vendor
  balance: { type: DataTypes.FLOAT, defaultValue: 0.00 }
});

// 5.3 Wallet Movements (Extrato / Histórico)
const WalletMovement = sequelize.define('WalletMovement', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  type: { type: DataTypes.ENUM('cashback', 'purchase', 'payout', 'deposit', 'withdrawal', 'fee'), allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  description: { type: DataTypes.STRING },
  direction: { type: DataTypes.ENUM('in', 'out'), allowNull: false } // Entrada ou Saída
});

WalletMovement.belongsTo(Wallet);
Wallet.hasMany(WalletMovement);

// 5.4 Payouts (Repasse Automático 80/10/10)
const Payout = sequelize.define('Payout', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  
  // Valores do Split
  amountDriver: { type: DataTypes.FLOAT, defaultValue: 0 },
  amountVendor: { type: DataTypes.FLOAT, defaultValue: 0 },
  amountPlatform: { type: DataTypes.FLOAT, defaultValue: 0 }, // Revenue
  
  status: { type: DataTypes.ENUM('pending', 'processing', 'paid'), defaultValue: 'pending' },
  paidAt: { type: DataTypes.DATE }
});

Payout.belongsTo(Transaction);
Transaction.hasOne(Payout);

Payout.belongsTo(Driver);
Payout.belongsTo(Vendor);

// 5.5 Platform Revenue (Receita da Plataforma)
const PlatformRevenue = sequelize.define('PlatformRevenue', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  source: { type: DataTypes.ENUM('order_commission', 'delivery_fee_share', 'subscription', 'ad'), defaultValue: 'order_commission' },
  amount: { type: DataTypes.FLOAT, allowNull: false }
});

PlatformRevenue.belongsTo(Transaction);

/**
 * ==========================================================
 * 6. GAMIFICAÇÃO E ENGAJAMENTO
 * ==========================================================
 */

// Listas Inteligentes
const SmartList = sequelize.define('SmartList', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM('manual', 'ai_suggestion', 'history'), defaultValue: 'manual' },
  isPublic: { type: DataTypes.BOOLEAN, defaultValue: false }
});

const SmartListItem = sequelize.define('SmartListItem', {
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 }
});

SmartList.belongsTo(Customer);
SmartList.belongsToMany(Product, { through: SmartListItem });
Product.belongsToMany(SmartList, { through: SmartListItem });

// Missões
const Mission = sequelize.define('Mission', {
  title: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  target: { type: DataTypes.INTEGER },
  rewardPoints: { type: DataTypes.INTEGER },
  type: { type: DataTypes.ENUM('order_count', 'spend', 'review', 'referral') },
  icon: { type: DataTypes.STRING }
});

const UserMission = sequelize.define('UserMission', {
  currentProgress: { type: DataTypes.INTEGER, defaultValue: 0 },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false },
  completedAt: { type: DataTypes.DATE }
});

Mission.belongsToMany(Customer, { through: UserMission });
Customer.belongsToMany(Mission, { through: UserMission });

// Avaliações
const Review = sequelize.define('Review', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  rating: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } },
  comment: { type: DataTypes.TEXT },
  reviewerRole: { type: DataTypes.ENUM('client', 'driver') },
  targetRole: { type: DataTypes.ENUM('market', 'driver', 'client') },
  targetId: { type: DataTypes.STRING } 
});

Review.belongsTo(Order); 

/**
 * ==========================================================
 * 7. SUPORTE E CHAT (IA)
 * ==========================================================
 */

const ChatSession = sequelize.define('ChatSession', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});

const ChatMessage = sequelize.define('ChatMessage', {
  sender: { type: DataTypes.ENUM('user', 'bot', 'support') },
  content: { type: DataTypes.TEXT },
  metadata: { type: DataTypes.JSONB } // Para armazenar payload da IA
});

ChatSession.belongsTo(User);
ChatSession.hasMany(ChatMessage);
ChatMessage.belongsTo(ChatSession);

// Exportar tudo
module.exports = {
  sequelize,
  Municipality,
  Role, Permission, RolePermission,
  User,
  Customer, Driver, Vendor,
  Category, Product,
  Order, OrderItem,
  Transaction, Payout, Wallet, WalletMovement, PlatformRevenue, // Banking Exports
  SmartList, SmartListItem,
  Mission, UserMission,
  Review,
  ChatSession, ChatMessage
};
