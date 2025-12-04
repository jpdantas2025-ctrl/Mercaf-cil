const { sequelize, Municipality, Market, Product } = require('./models');

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

    // 1. Criar Municípios
    const munData = municipios.map(name => ({ name }));
    await Municipality.bulkCreate(munData, { ignoreDuplicates: true });
    console.log('Municípios inseridos.');

    // 2. Criar Mercado em Boa Vista
    const bv = await Municipality.findOne({ where: { name: "Boa Vista" } });
    const market = await Market.create({ 
      name: 'Supermercado Central BV', 
      address: 'Av. Jaime Brasil, 123 - Centro', 
      MunicipalityId: bv.id 
    });

    // Configurar data futura para promoções (7 dias a partir de agora)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    // 3. Criar Produtos Variados
    await Product.bulkCreate([
      // Alimentos
      { 
        name: 'Arroz Branco Tipo 1 - 5kg', 
        category: 'Alimentos', 
        price: 26.90, 
        stock: 100, 
        MarketId: market.id,
        image: 'https://placehold.co/400x400/png?text=Arroz'
      },
      { 
        name: 'Feijão Carioca 1kg', 
        category: 'Alimentos', 
        price: 8.50, 
        stock: 150, 
        MarketId: market.id,
        image: 'https://placehold.co/400x400/png?text=Feijao'
      },
      { 
        name: 'Óleo de Soja 900ml', 
        category: 'Alimentos', 
        price: 6.99, 
        stock: 80, 
        MarketId: market.id, 
        promoPrice: 5.89, 
        promoUntil: nextWeek,
        image: 'https://placehold.co/400x400/png?text=Oleo'
      },
      { 
        name: 'Macarrão Espaguete 500g', 
        category: 'Alimentos', 
        price: 4.50, 
        stock: 200, 
        MarketId: market.id,
        image: 'https://placehold.co/400x400/png?text=Macarrao'
      },
      { 
        name: 'Farinha de Mandioca Amarela 1kg', 
        category: 'Alimentos', 
        price: 9.90, 
        stock: 60, 
        MarketId: market.id,
        image: 'https://placehold.co/400x400/png?text=Farinha'
      },

      // Laticínios
      { 
        name: 'Leite Integral 1L', 
        category: 'Laticínios', 
        price: 5.20, 
        stock: 120, 
        MarketId: market.id,
        image: 'https://placehold.co/400x400/png?text=Leite'
      },
      { 
        name: 'Queijo Mussarela Fatiado 150g', 
        category: 'Laticínios', 
        price: 12.90, 
        stock: 40, 
        MarketId: market.id,
        image: 'https://placehold.co/400x400/png?text=Queijo'
      },
      { 
        name: 'Iogurte Morango 170g', 
        category: 'Laticínios', 
        price: 3.50, 
        stock: 50, 
        MarketId: market.id,
        promoPrice: 2.99,
        promoUntil: nextWeek,
        image: 'https://placehold.co/400x400/png?text=Iogurte'
      },

      // Higiene
      { 
        name: 'Sabonete Hidratante 90g', 
        category: 'Higiene', 
        price: 2.50, 
        stock: 300, 
        MarketId: market.id,
        image: 'https://placehold.co/400x400/png?text=Sabonete'
      },
      { 
        name: 'Creme Dental 90g', 
        category: 'Higiene', 
        price: 4.90, 
        stock: 100, 
        MarketId: market.id,
        promoPrice: 3.99,
        promoUntil: nextWeek,
        image: 'https://placehold.co/400x400/png?text=Pasta'
      },
      { 
        name: 'Papel Higiênico Folha Dupla 12un', 
        category: 'Higiene', 
        price: 22.90, 
        stock: 80, 
        MarketId: market.id,
        image: 'https://placehold.co/400x400/png?text=Papel'
      },

      // Limpeza
      { 
        name: 'Sabão em Pó 800g', 
        category: 'Limpeza', 
        price: 14.50, 
        stock: 70, 
        MarketId: market.id,
        image: 'https://placehold.co/400x400/png?text=SabaoPo'
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
        name: 'Água Sanitária 2L', 
        category: 'Limpeza', 
        price: 6.50, 
        stock: 90, 
        MarketId: market.id,
        image: 'https://placehold.co/400x400/png?text=AguaSanitaria'
      }
    ]);

    console.log('Mercado de exemplo criado com 14 produtos variados.');
    process.exit(0);
  } catch (err) {
    console.error('Erro no seed:', err);
    process.exit(1);
  }
}

seed();