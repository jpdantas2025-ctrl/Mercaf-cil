export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  store: string;
  rating: number;
  sold: number;
  description: string;
  municipality?: string; // Associated municipality
  stock?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isVoice?: boolean;
}

export interface StoreProfile {
  id: string;
  name: string;
  location: string;
  rating: number;
  municipality: string;
}

export enum ViewState {
  HOME = 'HOME',
  VENDOR = 'VENDOR',
  PRODUCT = 'PRODUCT',
  CART = 'CART',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN'
}

export type Municipality = 
  | 'Boa Vista' 
  | 'Pacaraima' 
  | 'Bonfim' 
  | 'Normandia' 
  | 'Cantá' 
  | 'Mucajaí' 
  | 'Caracaraí' 
  | 'São João da Baliza' 
  | 'São Luiz do Anauá' 
  | 'Amajari' 
  | 'Uiramutã' 
  | 'Rorainópolis' 
  | 'Alto Alegre' 
  | 'Iracema' 
  | 'Caroebe';

export type VehicleType = 'motorcycle' | 'car' | 'bike' | 'walking';
export type DriverLevel = 'Bronze' | 'Prata' | 'Ouro' | 'Platina';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'accepted' | 'delivering' | 'delivered';
  municipality: string;
  customerName: string;
  driverId?: string;
  createdAt: Date;
  commission: {
    driver: number; // 10%
    platform: number; // 10%
    store: number; // 80%
  };
  distanceKm?: number;
  estimatedDeliveryTime?: number; // minutes
}

export interface Driver {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'offline';
  earnings: number;
  municipality: string;
  vehicleType: VehicleType;
  points: number;
  level: DriverLevel;
  currentOrderId?: string;
}