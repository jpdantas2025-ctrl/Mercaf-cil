
const { sequelize, Transaction, Payout, Wallet, WalletMovement, PlatformRevenue, Driver, Vendor, Customer } = require('../models');

class BankingService {
  
  /**
   * 1. Registrar Transação (Pagamento do Cliente)
   */
  static async createTransaction(orderId, customerId, amount, method = 'pix') {
    const transaction = await Transaction.create({
      OrderId: orderId,
      CustomerId: customerId,
      amount: amount,
      paymentMethod: method,
      status: 'confirmed' // Em prod, isso viria de webhook
    });
    return transaction;
  }

  /**
   * 2. Split Automático 80/10/10
   * Executado quando a entrega é finalizada.
   */
  static async processOrderSplit(order, transaction) {
    const t = await sequelize.transaction();

    try {
      const total = transaction.amount;

      // Definição das porcentagens
      const SHARE_VENDOR = 0.80;
      const SHARE_DRIVER = 0.10;
      const SHARE_PLATFORM = 0.10;

      const vendorAmount = total * SHARE_VENDOR;
      const driverAmount = total * SHARE_DRIVER;
      const platformAmount = total * SHARE_PLATFORM;

      // 2.1 Criar Payout Record
      const payout = await Payout.create({
        TransactionId: transaction.id,
        DriverId: order.DriverId,
        VendorId: order.VendorId, // Sequelize alias for MarketId usually, check model
        amountDriver: driverAmount,
        amountVendor: vendorAmount,
        amountPlatform: platformAmount,
        status: 'paid', // Consideramos 'paid' no sistema interno (crédito na wallet)
        paidAt: new Date()
      }, { transaction: t });

      // 2.2 Atualizar Wallet do Motorista
      if (order.DriverId) {
        await this._creditWallet('driver', order.DriverId, driverAmount, `Corrida #${order.id.slice(0,8)}`, t);
        
        // Atualizar saldo direto na tabela Driver para performance
        const driver = await Driver.findByPk(order.DriverId, { transaction: t });
        driver.totalEarned += driverAmount;
        driver.availableAmount += driverAmount;
        await driver.save({ transaction: t });
      }

      // 2.3 Atualizar Wallet do Lojista
      if (order.VendorId) { // or MarketId based on exact implementation
        await this._creditWallet('vendor', order.VendorId, vendorAmount, `Venda Pedido #${order.id.slice(0,8)}`, t);
        
        const vendor = await Vendor.findByPk(order.VendorId, { transaction: t });
        vendor.availableBalance += vendorAmount;
        await vendor.save({ transaction: t });
      }

      // 2.4 Registrar Receita da Plataforma
      await PlatformRevenue.create({
        TransactionId: transaction.id,
        source: 'order_commission',
        amount: platformAmount
      }, { transaction: t });

      // 2.5 Processar Cashback do Cliente (5%)
      const CASHBACK_RATE = 0.05;
      const cashbackAmount = total * CASHBACK_RATE;
      await this._creditWallet('customer', order.CustomerId, cashbackAmount, `Cashback Pedido #${order.id.slice(0,8)}`, t);

      await t.commit();
      return payout;

    } catch (error) {
      await t.rollback();
      console.error("Banking Split Error:", error);
      throw error;
    }
  }

  /**
   * Helper: Creditar Wallet Genérica
   */
  static async _creditWallet(ownerType, ownerId, amount, description, t) {
    let wallet = await Wallet.findOne({ 
      where: { ownerType, ownerId }, 
      transaction: t 
    });

    if (!wallet) {
      wallet = await Wallet.create({ ownerType, ownerId, balance: 0 }, { transaction: t });
    }

    wallet.balance += amount;
    await wallet.save({ transaction: t });

    await WalletMovement.create({
      WalletId: wallet.id,
      type: description.includes('Cashback') ? 'cashback' : 'payout',
      amount: amount,
      direction: 'in',
      description: description
    }, { transaction: t });
  }

  /**
   * 3. Obter Extrato
   */
  static async getExtract(ownerType, ownerId) {
    const wallet = await Wallet.findOne({ where: { ownerType, ownerId } });
    if (!wallet) return { balance: 0, movements: [] };

    const movements = await WalletMovement.findAll({
      where: { WalletId: wallet.id },
      order: [['createdAt', 'DESC']]
    });

    return {
      balance: wallet.balance,
      movements
    };
  }
}

module.exports = BankingService;
