
const express = require('express');
const BankingService = require('../services/bankingService');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// GET /api/banking/balance
// Retorna saldo e extrato do usuário logado (seja Driver, Vendor ou Customer)
router.get('/balance', authMiddleware, async (req, res) => {
  try {
    let ownerType, ownerId;

    if (req.userType === 'driver') {
        ownerType = 'driver';
        ownerId = req.user.id;
    } else {
        // Se for user, ver se é customer ou vendor (pela role)
        const role = req.user.Role ? req.user.Role.name : req.user.role;
        if (role === 'mercado') { // Ajustar conforme seed
             ownerType = 'vendor';
             // Em um app real, o user pode ter varios vendors, aqui pegamos o primeiro
             const vendor = await req.user.getVendors(); 
             if(vendor && vendor.length > 0) ownerId = vendor[0].id;
             else return res.status(404).json({error: "Vendor profile not found"});
        } else {
             ownerType = 'customer';
             const customer = await req.user.getCustomer();
             if(customer) ownerId = customer.id;
             else return res.status(404).json({error: "Customer profile not found"});
        }
    }

    const data = await BankingService.getExtract(ownerType, ownerId);
    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar dados bancários' });
  }
});

// POST /api/banking/withdraw
// Simula saque Pix
router.post('/withdraw', authMiddleware, async (req, res) => {
    // Implementação de saque (Debit Wallet)
    res.json({ message: "Solicitação de saque enviada (Simulado)" });
});

module.exports = router;
