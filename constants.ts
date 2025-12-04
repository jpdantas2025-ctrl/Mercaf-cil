import { Product, StoreProfile, Driver, Municipality } from './types';

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

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Café Regional Roraima 500g',
    price: 18.50,
    originalPrice: 22.00,
    image: 'https://picsum.photos/400/400?random=1',
    category: 'Mercearia',
    store: 'Supermercado Goiana',
    rating: 4.8,
    sold: 1200,
    description: 'O autêntico café da região, torra média, sabor intenso.',
    municipality: 'Boa Vista',
    stock: 50
  },
  {
    id: '2',
    name: 'Farinha de Mandioca Amarela 1kg',
    price: 8.90,
    originalPrice: 10.50,
    image: 'https://picsum.photos/400/400?random=2',
    category: 'Grãos',
    store: 'Mercado do Produtor',
    rating: 4.9,
    sold: 3400,
    description: 'Farinha d\'água crocante, ideal para farofas e acompanhamentos.',
    municipality: 'Rorainópolis',
    stock: 200
  },
  {
    id: '3',
    name: 'Kit Churrasco Completo (Picanha + Linguiça)',
    price: 129.90,
    originalPrice: 159.90,
    image: 'https://picsum.photos/400/400?random=3',
    category: 'Açougue',
    store: 'Frigoboi BV',
    rating: 4.7,
    sold: 450,
    description: 'Kit perfeito para o fim de semana. Picanha maturada e linguiça toscana.',
    municipality: 'Boa Vista',
    stock: 15
  },
  {
    id: '4',
    name: 'Açaí Puro da Amazônia 1L',
    price: 25.00,
    image: 'https://picsum.photos/400/400?random=4',
    category: 'Congelados',
    store: 'Açaí do Norte',
    rating: 5.0,
    sold: 890,
    description: 'Polpa de açaí médio, sem conservantes.',
    municipality: 'Pacaraima',
    stock: 30
  },
  {
    id: '5',
    name: 'Detergente Líquido 500ml',
    price: 2.99,
    image: 'https://picsum.photos/400/400?random=5',
    category: 'Limpeza',
    store: 'Supermercado Goiana',
    rating: 4.5,
    sold: 5000,
    description: 'Limpeza profunda com cheirinho de limão.',
    municipality: 'Boa Vista',
    stock: 500
  },
  {
    id: '6',
    name: 'Tambaqui Fresco (Kg)',
    price: 19.90,
    originalPrice: 24.90,
    image: 'https://picsum.photos/400/400?random=6',
    category: 'Peixaria',
    store: 'Mercado do Peixe',
    rating: 4.8,
    sold: 600,
    description: 'Peixe fresco da região, limpo e pronto para o preparo.',
    municipality: 'Caracaraí',
    stock: 45
  }
];

export const CATEGORIES = [
  { name: 'Ofertas Relâmpago', icon: 'zap' },
  { name: 'Mercearia', icon: 'shopping-bag' },
  { name: 'Açougue', icon: 'beef' },
  { name: 'Hortifruti', icon: 'carrot' },
  { name: 'Bebidas', icon: 'beer' },
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
    level: 'Bronze' 
  },
  { 
    id: 'd2', 
    name: 'Ana Entregas', 
    status: 'busy', 
    earnings: 340.00, 
    municipality: 'Boa Vista', 
    vehicleType: 'car', 
    points: 450, 
    level: 'Prata' 
  },
  { 
    id: 'd3', 
    name: 'Pedro Rorainópolis', 
    status: 'available', 
    earnings: 80.00, 
    municipality: 'Rorainópolis', 
    vehicleType: 'bike', 
    points: 20, 
    level: 'Bronze' 
  },
  { 
    id: 'd4', 
    name: 'Marcos Veloz', 
    status: 'offline', 
    earnings: 1200.00, 
    municipality: 'Boa Vista', 
    vehicleType: 'motorcycle', 
    points: 700, 
    level: 'Platina' 
  }
];