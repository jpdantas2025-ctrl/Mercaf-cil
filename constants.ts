
import { Product, StoreProfile, Driver, Municipality, Mission, SmartList } from './types';

export const MUNICIPALITIES: Municipality[] = [
  'Boa Vista',
  'Pacaraima',
  'Bonfim',
  'Normandia',
  'Cantá',
  'Mucajaí',
  'Caracaraí',
  'São João da Baliza',
  'São Luiz do Anauá',
  'Amajari',
  'Uiramutã',
  'Rorainópolis',
  'Alto Alegre',
  'Iracema',
  'Caroebe'
];

// Using Pollinations.ai to generate high-conversion commercial photography on the fly
// Prompts optimized for marketplace conversion: realistic, commercial lighting, water drops, high contrast
const getAIImage = (prompt: string) => 
  `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ", commercial product photography, 8k, sharp focus, vibrant colors, studio lighting, advertising style, high contrast, appetizing, clean background, award winning photography")}?nolog=true`;

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '101',
    name: 'Banana Nanica (Kg)',
    price: 4.99,
    originalPrice: 6.50,
    image: getAIImage('bunch of fresh ripe yellow bananas with water droplets, vibrant yellow, tropical fruit, clean background, high contrast, commercial photography'),
    category: 'Hortifruti',
    store: 'Hortifruti do Centro',
    rating: 4.9,
    sold: 1540,
    description: 'Bananas frescas, doces e ricas em potássio. Ideais para o dia a dia.',
    municipality: 'Boa Vista',
    stock: 200,
    isHealthy: true
  },
  {
    id: '102',
    name: 'Leite Integral 1L',
    price: 5.49,
    image: getAIImage('milk carton pouring milk into a glass, splash, fresh, blue background, studio lighting, product photography, hyperrealistic'),
    category: 'Laticínios',
    store: 'Supermercado Goiana',
    rating: 4.8,
    sold: 3200,
    description: 'Leite integral de alta qualidade, fonte de cálcio e vitaminas.',
    municipality: 'Boa Vista',
    stock: 500,
    isDiscountHunt: true // Hidden Discount Badge
  },
  {
    id: '103',
    name: 'Arroz Tipo 1 (5kg)',
    price: 28.90,
    originalPrice: 32.00,
    image: getAIImage('bag of white rice 5kg packaging, raw grains texture, kitchen countertop, warm lighting, high quality, advertising shot'),
    category: 'Mercearia',
    store: 'Mercado do Produtor',
    rating: 4.7,
    sold: 980,
    description: 'Grãos selecionados, soltinho e saboroso. O básico que não pode faltar.',
    municipality: 'Rorainópolis',
    stock: 150
  },
  {
    id: '104',
    name: 'Refrigerante Coca-Cola 2L',
    price: 11.99,
    image: getAIImage('coca cola 2L plastic bottle, cold, condensation, ice cubes, red background, fizzy drink, advertising shot, cinematic lighting'),
    category: 'Bebidas',
    store: 'Supermercado Goiana',
    rating: 5.0,
    sold: 5400,
    description: 'O sabor inconfundível. Refresque seu dia com uma Coca gelada.',
    municipality: 'Boa Vista',
    stock: 300
  },
  {
    id: '105',
    name: 'Sabão em Pó OMO 1kg',
    price: 14.90,
    originalPrice: 18.90,
    image: getAIImage('laundry detergent powder box, blue packaging, clean white towels background, bright freshness, sparkles, washing machine context'),
    category: 'Limpeza',
    store: 'Mercado da Fronteira',
    rating: 4.9,
    sold: 1200,
    description: 'Limpeza profunda que cuida das roupas. Perfume duradouro.',
    municipality: 'Pacaraima',
    stock: 100
  },
  {
    id: '106',
    name: 'Frango Congelado Inteiro (Kg)',
    price: 9.99,
    originalPrice: 13.50,
    image: getAIImage('whole raw chicken fresh ready to cook on wooden board, herbs, rosemary, professional food photography, studio lighting, appetizing'),
    category: 'Açougue',
    store: 'Frigoboi BV',
    rating: 4.6,
    sold: 800,
    description: 'Frango de qualidade, ideal para assados de domingo.',
    municipality: 'Boa Vista',
    stock: 80,
    isHealthy: true
  },
  {
    id: '107',
    name: 'Cesta Básica Econômica',
    price: 89.90,
    originalPrice: 110.00,
    image: getAIImage('food basket hamper with rice beans oil pasta sugar coffee, cardboard box, bountiful, kitchen background, warm lighting'),
    category: 'Mercearia',
    store: 'Mercafácil Oficial',
    rating: 5.0,
    sold: 150,
    description: 'Kit completo: Arroz, Feijão, Óleo, Açúcar e Café. Compre e ganhe cupom extra!',
    municipality: 'Boa Vista',
    stock: 50,
    isBundle: true
  },
  {
    id: '108',
    name: 'Pão Francês (Kg)',
    price: 12.90,
    image: getAIImage('basket of fresh french bread rolls, bakery setting, warm lighting, flour dust, steam, delicious'),
    category: 'Padaria',
    store: 'Padaria do Moinho',
    rating: 4.8,
    sold: 2000,
    description: 'Pãozinho quente saindo do forno toda hora. Crocante e macio.',
    municipality: 'Boa Vista',
    stock: 100
  },
  // --- NOVOS PRODUTOS HORTIFRUTI ---
  {
    id: '109',
    name: 'Tomate Longa Vida (Kg)',
    price: 6.99,
    image: getAIImage('fresh red tomatoes with water droplets, green stems, wooden crate, rustic background, vibrant red, high quality'),
    category: 'Hortifruti',
    store: 'Hortifruti do Centro',
    rating: 4.5,
    sold: 890,
    description: 'Tomates vermelhos e firmes, selecionados para sua salada.',
    municipality: 'Boa Vista',
    stock: 150,
    isHealthy: true
  },
  {
    id: '110',
    name: 'Cebola Branca (Kg)',
    price: 4.50,
    image: getAIImage('fresh white onions, mesh bag, rustic kitchen background, natural light, cooking ingredients'),
    category: 'Hortifruti',
    store: 'Mercado do Produtor',
    rating: 4.4,
    sold: 600,
    description: 'Cebolas frescas e ideais para temperar seus pratos.',
    municipality: 'Rorainópolis',
    stock: 300,
    isHealthy: true
  },
  {
    id: '111',
    name: 'Batata Inglesa (Kg)',
    price: 5.90,
    image: getAIImage('washed potatoes pile, earth tones, fresh vegetable market display, high resolution'),
    category: 'Hortifruti',
    store: 'Supermercado Goiana',
    rating: 4.7,
    sold: 1200,
    description: 'Batatas versáteis, ótimas para purês, fritas ou assadas.',
    municipality: 'Boa Vista',
    stock: 400
  },
  {
    id: '112',
    name: 'Maçã Gala (Kg)',
    price: 8.90,
    originalPrice: 10.90,
    image: getAIImage('red gala apples crisp shiny, stacked in a fruit bowl, kitchen setting, healthy snack'),
    category: 'Hortifruti',
    store: 'Hortifruti do Centro',
    rating: 4.8,
    sold: 750,
    description: 'Maçãs doces e crocantes, ricas em fibras.',
    municipality: 'Boa Vista',
    stock: 120,
    isHealthy: true
  },
  {
    id: '113',
    name: 'Alface Crespa (Un)',
    price: 2.50,
    image: getAIImage('fresh green curly lettuce head, water drops, garden background, vibrant green, healthy food'),
    category: 'Hortifruti',
    store: 'Hortifruti do Centro',
    rating: 4.6,
    sold: 500,
    description: 'Folhas verdes e frescas, direto da horta para sua mesa.',
    municipality: 'Boa Vista',
    stock: 50,
    isHealthy: true
  },
  // --- NOVOS PRODUTOS AÇOUGUE ---
  {
    id: '114',
    name: 'Carne Moída Patinho (500g)',
    price: 22.90,
    image: getAIImage('raw ground beef fresh red meat on butcher paper, rosemary sprig, high protein, cooking preparation'),
    category: 'Açougue',
    store: 'Frigoboi BV',
    rating: 4.8,
    sold: 900,
    description: 'Carne magra moída na hora, perfeita para molhos e hambúrgueres.',
    municipality: 'Boa Vista',
    stock: 80
  },
  {
    id: '115',
    name: 'Linguiça Toscana (Kg)',
    price: 19.90,
    image: getAIImage('raw tuscan sausages on wooden board, bbq preparation, herbs, rustic style, appetizing'),
    category: 'Açougue',
    store: 'Mercado da Fronteira',
    rating: 4.7,
    sold: 1100,
    description: 'A rainha do churrasco. Saborosa e suculenta.',
    municipality: 'Pacaraima',
    stock: 150
  },
  {
    id: '116',
    name: 'Bisteca Suína (Kg)',
    price: 16.90,
    originalPrice: 21.00,
    image: getAIImage('raw pork chops fresh meat cuts on stone plate, seasoning, pepper, culinary photography'),
    category: 'Açougue',
    store: 'Frigoboi BV',
    rating: 4.5,
    sold: 400,
    description: 'Corte suíno macio e saboroso.',
    municipality: 'Boa Vista',
    stock: 60
  },
  // --- NOVOS PRODUTOS MERCEARIA ---
  {
    id: '117',
    name: 'Feijão Carioca 1kg',
    price: 8.49,
    image: getAIImage('bag of pinto beans carioca beans, spilled grains, kitchen texture, brazilian food staple'),
    category: 'Mercearia',
    store: 'Mercado do Produtor',
    rating: 4.9,
    sold: 2100,
    description: 'Feijão novo, cozinha rápido e tem caldo grosso.',
    municipality: 'Rorainópolis',
    stock: 300
  },
  {
    id: '118',
    name: 'Macarrão Espaguete 500g',
    price: 4.29,
    image: getAIImage('uncooked spaghetti pasta packet, italian food ingredients, tomatoes basil background, high quality'),
    category: 'Mercearia',
    store: 'Supermercado Goiana',
    rating: 4.6,
    sold: 1500,
    description: 'Massa de sêmola, soltinha e ideal para o almoço de domingo.',
    municipality: 'Boa Vista',
    stock: 400
  },
  {
    id: '119',
    name: 'Óleo de Soja 900ml',
    price: 6.99,
    image: getAIImage('soybean oil plastic bottle golden liquid, kitchen background, cooking essential, backlit'),
    category: 'Mercearia',
    store: 'Mercafácil Oficial',
    rating: 4.8,
    sold: 5000,
    description: 'Óleo refinado de qualidade para suas receitas.',
    municipality: 'Boa Vista',
    stock: 600
  },
  {
    id: '120',
    name: 'Café Torrado e Moído 500g',
    price: 18.90,
    originalPrice: 22.00,
    image: getAIImage('coffee powder pack and a cup of hot coffee with steam, dark roast, morning vibe, aroma'),
    category: 'Mercearia',
    store: 'Mercado da Fronteira',
    rating: 4.9,
    sold: 1300,
    description: 'O café forte que o brasileiro gosta. Aroma intenso.',
    municipality: 'Pacaraima',
    stock: 200
  },
  {
    id: '121',
    name: 'Açúcar Refinado 1kg',
    price: 4.89,
    image: getAIImage('white sugar pack pouring into a bowl, sweet crystals, baking ingredients, clean white background'),
    category: 'Mercearia',
    store: 'Supermercado Goiana',
    rating: 4.7,
    sold: 2200,
    description: 'Açúcar branquinho e soltinho para adoçar a vida.',
    municipality: 'Boa Vista',
    stock: 350
  },
  // --- NOVOS PRODUTOS BEBIDAS ---
  {
    id: '122',
    name: 'Cerveja Heineken Long Neck 330ml',
    price: 6.49,
    image: getAIImage('heineken beer bottle cold with condensation, green glass, bar counter background, party vibe'),
    category: 'Bebidas',
    store: 'Supermercado Goiana',
    rating: 5.0,
    sold: 8000,
    description: 'Cerveja Premium puro malte. Gelada é melhor ainda.',
    municipality: 'Boa Vista',
    stock: 1000
  },
  {
    id: '123',
    name: 'Suco de Laranja Integral 1L',
    price: 12.90,
    image: getAIImage('orange juice glass bottle, fresh oranges around, sunny breakfast, vitamin c, healthy drink'),
    category: 'Bebidas',
    store: 'Hortifruti do Centro',
    rating: 4.8,
    sold: 600,
    description: '100% fruta, sem adição de açúcares.',
    municipality: 'Boa Vista',
    stock: 100,
    isHealthy: true
  },
  {
    id: '124',
    name: 'Água Mineral sem Gás 1.5L',
    price: 2.99,
    image: getAIImage('plastic water bottle 1.5L pure clean water, blue background, hydration, refreshing'),
    category: 'Bebidas',
    store: 'Mercado do Produtor',
    rating: 4.9,
    sold: 3000,
    description: 'Hidratação pura e leve para o seu dia.',
    municipality: 'Rorainópolis',
    stock: 500
  },
  // --- NOVOS PRODUTOS LATICÍNIOS ---
  {
    id: '125',
    name: 'Queijo Mussarela Fatiado 150g',
    price: 9.90,
    image: getAIImage('sliced mozzarella cheese pack, sandwich preparation, fresh dairy, appetizing yellow'),
    category: 'Laticínios',
    store: 'Supermercado Goiana',
    rating: 4.8,
    sold: 1500,
    description: 'Fatias soltinhas, ideal para sanduíches e pizzas.',
    municipality: 'Boa Vista',
    stock: 200
  },
  {
    id: '126',
    name: 'Iogurte Natural 170g',
    price: 3.29,
    image: getAIImage('plain yogurt cup with spoon, creamy texture, healthy breakfast, white background'),
    category: 'Laticínios',
    store: 'Mercado da Fronteira',
    rating: 4.6,
    sold: 400,
    description: 'Iogurte integral, cremoso e saudável.',
    municipality: 'Pacaraima',
    stock: 100,
    isHealthy: true
  },
  {
    id: '127',
    name: 'Manteiga com Sal 200g',
    price: 11.90,
    image: getAIImage('butter block on dish, knife spreading butter on toast, golden yellow, breakfast table'),
    category: 'Laticínios',
    store: 'Supermercado Goiana',
    rating: 4.9,
    sold: 850,
    description: 'Sabor tradicional da fazenda no seu café da manhã.',
    municipality: 'Boa Vista',
    stock: 150
  },
  // --- NOVOS PRODUTOS PADARIA ---
  {
    id: '128',
    name: 'Pão de Forma Tradicional',
    price: 7.50,
    image: getAIImage('sliced white bread loaf in packaging, soft texture, sandwich making, breakfast essential'),
    category: 'Padaria',
    store: 'Padaria do Moinho',
    rating: 4.7,
    sold: 1200,
    description: 'Macio e fresquinho, perfeito para torradas.',
    municipality: 'Boa Vista',
    stock: 180
  },
  {
    id: '129',
    name: 'Bolo de Chocolate (Un)',
    price: 18.90,
    image: getAIImage('chocolate cake whole, rich frosting, delicious dessert, bakery display, tempting'),
    category: 'Padaria',
    store: 'Padaria do Moinho',
    rating: 4.9,
    sold: 300,
    description: 'Bolo caseiro fofinho com cobertura de chocolate.',
    municipality: 'Boa Vista',
    stock: 20
  },
  // --- NOVOS PRODUTOS LIMPEZA ---
  {
    id: '130',
    name: 'Detergente Líquido Neutro 500ml',
    price: 2.39,
    image: getAIImage('dish soap bottle yellow liquid, bubbles, kitchen sink, cleaning product'),
    category: 'Limpeza',
    store: 'Mercafácil Oficial',
    rating: 4.8,
    sold: 4000,
    description: 'Alto poder desengordurante com rendimento superior.',
    municipality: 'Boa Vista',
    stock: 600
  },
  {
    id: '131',
    name: 'Água Sanitária 1L',
    price: 3.99,
    image: getAIImage('bleach bottle white plastic, clean bathroom background, disinfection, hygiene'),
    category: 'Limpeza',
    store: 'Mercado do Produtor',
    rating: 4.7,
    sold: 2500,
    description: 'Ação 3 em 1: alveja, desinfeta e mata germes.',
    municipality: 'Rorainópolis',
    stock: 300
  },
  {
    id: '132',
    name: 'Amaciante de Roupas 2L',
    price: 12.90,
    originalPrice: 15.50,
    image: getAIImage('fabric softener blue bottle, soft towels stack, laundry room, fresh scent, comfort'),
    category: 'Limpeza',
    store: 'Supermercado Goiana',
    rating: 4.9,
    sold: 900,
    description: 'Maciez e perfume prolongado para suas roupas.',
    municipality: 'Boa Vista',
    stock: 200
  }
];

export const CATEGORIES = [
  { name: 'Ofertas Relâmpago', icon: 'zap' },
  { name: 'Mercearia', icon: 'shopping-bag' },
  { name: 'Açougue', icon: 'beef' },
  { name: 'Hortifruti', icon: 'carrot' },
  { name: 'Bebidas', icon: 'beer' },
  { name: 'Laticínios', icon: 'milk' },
  { name: 'Padaria', icon: 'croissant' },
  { name: 'Limpeza', icon: 'sparkles' },
];

export const STORES: StoreProfile[] = [
  { id: '1', name: 'Supermercado Goiana', location: 'Boa Vista, RR', rating: 4.8, municipality: 'Boa Vista' },
  { id: '2', name: 'Mercado do Produtor', location: 'Rorainópolis, RR', rating: 4.6, municipality: 'Rorainópolis' },
  { id: '3', name: 'Mercado da Fronteira', location: 'Pacaraima, RR', rating: 4.5, municipality: 'Pacaraima' },
];

export const MOCK_DRIVERS: Driver[] = [
  { 
    id: 'd1', 
    name: 'Carlos Motoboy', 
    status: 'available', 
    earnings: 150.50,
    municipality: 'Boa Vista', 
    vehicleType: 'motorcycle', 
    points: 80, 
    level: 'Bronze',
    rating: 4.8,
    deliveriesCompleted: 12,
    weeklyGoal: { target: 20, current: 12, reward: 50, expiresIn: '2 dias' },
    earningsHistory: []
  },
  { 
    id: 'd2', 
    name: 'Ana Entregas', 
    status: 'busy', 
    earnings: 340.00, 
    municipality: 'Boa Vista', 
    vehicleType: 'car', 
    points: 450, 
    level: 'Prata',
    rating: 4.95,
    deliveriesCompleted: 45,
    weeklyGoal: { target: 50, current: 45, reward: 100, expiresIn: '2 dias' },
    earningsHistory: []
  },
  { 
    id: 'd3', 
    name: 'Pedro Rorainópolis', 
    status: 'available', 
    earnings: 80.00, 
    municipality: 'Rorainópolis', 
    vehicleType: 'bike', 
    points: 20, 
    level: 'Bronze',
    rating: 4.5,
    deliveriesCompleted: 5,
    weeklyGoal: { target: 10, current: 5, reward: 20, expiresIn: '2 dias' },
    earningsHistory: []
  },
  { 
    id: 'd4', 
    name: 'Marcos Veloz', 
    status: 'offline', 
    earnings: 1200.00, 
    municipality: 'Boa Vista', 
    vehicleType: 'motorcycle', 
    points: 700, 
    level: 'Platina',
    rating: 5.0,
    deliveriesCompleted: 150,
    weeklyGoal: { target: 20, current: 20, reward: 150, expiresIn: '2 dias' },
    earningsHistory: []
  }
];

export const MOCK_MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'Explorador de Mercados',
    description: 'Compre em 2 mercados diferentes esta semana',
    target: 2,
    current: 1,
    reward: 100,
    icon: 'store',
    completed: false,
    type: 'order_count'
  },
  {
    id: 'm2',
    title: 'Crítico Gastronômico',
    description: 'Avalie 3 entregas recentes',
    target: 3,
    current: 0,
    reward: 50,
    icon: 'star',
    completed: false,
    type: 'review'
  },
  {
    id: 'm3',
    title: 'Economia Inteligente',
    description: 'Gaste R$ 100 em produtos da "Lista Econômica"',
    target: 100,
    current: 45,
    reward: 150,
    icon: 'wallet',
    completed: false,
    type: 'spend'
  }
];

// Mock Smart Lists for AI & History
export const MOCK_SMART_LISTS: SmartList[] = [
  {
    id: 'list_ai_1',
    name: 'Churrasco do Fim de Semana',
    type: 'ai_suggestion',
    items: [
      { ...MOCK_PRODUCTS[5], quantity: 2 }, // Frango
      { ...MOCK_PRODUCTS[3], quantity: 2 }, // Coca
      { ...MOCK_PRODUCTS[2], quantity: 1 }  // Arroz (side dish)
    ],
    timesPurchased: 0,
    totalSaved: 12.50,
    createdAt: new Date(),
    tags: ['Churrasco', 'Lazer', 'Fim de Semana']
  },
  {
    id: 'list_ai_2',
    name: 'Básico da Casa',
    type: 'ai_suggestion',
    items: [
      { ...MOCK_PRODUCTS[2], quantity: 2 }, // Arroz
      { ...MOCK_PRODUCTS[1], quantity: 6 }, // Leite
      { ...MOCK_PRODUCTS[4], quantity: 1 }, // Sabão
      { ...MOCK_PRODUCTS[0], quantity: 1 }  // Banana
    ],
    timesPurchased: 0,
    totalSaved: 5.00,
    createdAt: new Date(),
    tags: ['Mensal', 'Essencial', 'Família']
  }
];
