
const { sequelize, Municipality, Market, Product, Role, Permission } = require('./models');

const municipios = [
  "Boa Vista",
  "Pacaraima",
  "Bonfim",
  "Normandia",
  "Cantá",
  "Mucajaí",
  "Caracaraí",
  "São João da Baliza",
  "São Luiz do Anauá",
  "Amajari",
  "Uiramutã",
  "Rorainópolis",
  "Alto Alegre",
  "Iracema",
  "Caroebe"
];

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Banco sincronizado (force).');

    // 1. Setup RBAC (Roles & Permissions)
    const rolesData = ['admin', 'cliente', 'entregador', 'mercado'];
    const roles = {};
    for (const r of rolesData) {
      roles[r] = await Role.create({ name: r });
    }

    const permissionsData = [
      'market:create', 'market:update', 'market:delete',
      'product:create', 'product:update', 'product:delete',
      'order:view_all', 'driver:approve', 'driver:block',
      'payout:view'
    ];
    
    // Admin gets all permissions
    for (const pName of permissionsData) {
      const perm = await Permission.create({ name: pName });
      await roles['admin'].addPermission(perm);
    }
    
    // Mercado permissions
    const marketPerms = ['product:create', 'product:update', 'product:delete'];
    for (const pName of marketPerms) {
      const perm = await Permission.findOne({ where: { name: pName } });
      if (perm) await roles['mercado'].addPermission(perm);
    }

    console.log('Roles e Permissões configurados.');

    // 2. Criar Municípios
    const munData = municipios.map(name => ({ name }));
    await Municipality.bulkCreate(munData, { ignoreDuplicates: true });
    console.log('Municípios inseridos.');

    // 3. Criar Mercado em Boa Vista
    const bv = await Municipality.findOne({ where: { name: "Boa Vista" } });
    const market = await Market.create({ 
      name: 'Supermercado Central BV', 
      address: 'Av. Jaime Brasil, 123 - Centro', 
      MunicipalityId: bv.id 
    });

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    // 4. Criar Produtos Variados
    await Product.bulkCreate([
      { 
        name: 'Arroz Branco Tipo 1 - 5kg', 
        category: 'Mercearia', 
        price: 26.90, 
        stock: 100, 
        MarketId: market.id,
        image: 'https://placehold.co/400x400/png?text=Arroz'
      },
      { 
        name: 'Óleo de Soja 900ml', 
        category: 'Mercearia', 
        price: 6.99, 
        stock: 80, 
        MarketId: market.id, 
        promoPrice: 5.89, 
        promoUntil: nextWeek,
        image: 'https://placehold.co/400x400/png?text=Oleo'
      },
      { 
        name: 'Sabonete Hidratante 90g', 
        category: 'Higiene', 
        price: 2.50, 
        stock: 300, 
        MarketId: market.id,
        image: 'https://placehold.co/400x400/png?text=Sabonete'
      },
      { 
        name: 'Detergente Líquido 500ml', 
        category: 'Limpeza', 
        price: 2.89, 
        stock: 200, 
        MarketId: market.id, 
        promoPrice: 2.49, 
        promoUntil: nextWeek,
        image: 'https://placehold.co/400x400/png?text=Detergente'
      },
      {
        name: 'Feijão Carioca 1kg',
        category: 'Mercearia',
        price: 8.49,
        stock: 150,
        MarketId: market.id,
        image: 'https://placehold.co/400x400/png?text=Feijao'
      },
      {
        name: 'Macarrão Espaguete 500g',
        category: 'Mercearia',
        price: 4.29,
        stock: 200,
        MarketId: market.id,
        image: 'https://placehold.co/400x400/png?text=Macarrao'
      },
      {
        name: 'Café Torrado e Moído 500g',
        category: 'Mercearia',
        price: 18.90,
        stock: 100,
        MarketId: market.id,
        image: 'https://placehold.co/400x400/png?text=Cafe'
      },
      {
        name: 'Açúcar Refinado 1kg',
        category: 'Mercearia',
        price: 4.89,
        stock: 180,
        MarketId: market.id,
        image: 'https://placehold.co/400x400/png?text=Acucar'
      },
      {
        name: 'Leite Integral 1L',
        category: 'Laticínios',
        price: 5.49,
        stock: 240,
        MarketId: market.id,
        image: 'https://placehold.co/400x400/png?text=Leite'
      },
      {
        name: 'Manteiga com Sal 200g',
        category: 'Laticínios',
        price: 11.90,
        stock: 50,
        MarketId: market.id,
        image: 'https://placehold.co/400x400/png?text=Manteiga'
      },
      {
        name: 'Pão de Forma Tradicional',
        category: 'Padaria',
        price: 7.50,
        stock: 60,
        MarketId: market.id,
        image: 'https://placehold.co/400x400/png?text=Pao'
      },
      {
        name: 'Água Sanitária 1L',
        category: 'Limpeza',
        price: 3.99,
        stock: 120,
        MarketId: market.id,
        image: 'https://placehold.co/400x400/png?text=AguaSanitaria'
      }
    ]);

    console.log('Mercado de exemplo criado com produtos.');
    process.exit(0);
  } catch (err) {
    console.error('Erro no seed:', err);
    process.exit(1);
  }
}

seed();
