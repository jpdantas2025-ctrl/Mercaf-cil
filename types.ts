

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
  isHealthy?: boolean; // New: For Nutritional Mode
  isDiscountHunt?: boolean; // New: For Discount Hunt Mode
  isBundle?: boolean; // New: For Economy Bundles
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
  ADMIN = 'ADMIN',
  LISTS = 'LISTS',
  GAMIFICATION = 'GAMIFICATION' // New View
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

export type VehicleType = 'motorcycle' | 'car' | 'bike' | 'walking' | 'on_foot';
export type DriverLevel = 'Bronze' | 'Prata' | 'Ouro' | 'Platina';
export type DeliveryType = 'standard' | 'express' | 'scheduled';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'accepted' | 'delivering' | 'delivered' | 'returned';
  municipality: string;
  customerName: string;
  driverId?: string;
  createdAt: Date;
  commission: {
    driver: number; // calculated dynamically
    platform: number; 
    store: number; 
  };
  distanceKm?: number;
  estimatedDeliveryTime?: number; // minutes
  deliveryType?: DeliveryType;
  substitutionPreference: 'substitute' | 'refund' | 'contact'; // New: Substitution Logic
  reviewedByClient?: boolean;
  reviewedByDriver?: boolean;
}

export interface DriverWeeklyGoal {
  target: number;
  current: number;
  reward: number;
  expiresIn: string; // "2 dias"
}

export interface Driver {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'offline';
  earnings: number; // Current Wallet Balance
  earningsHistory?: { date: string; amount: number; type: string }[];
  municipality: string;
  vehicleType: VehicleType;
  points: number;
  level: DriverLevel;
  rating: number; // 0-5 stars
  deliveriesCompleted: number; // Total or Monthly
  weeklyGoal: DriverWeeklyGoal;
  currentOrderId?: string;
  pixKey?: string;
  referralCode?: string;
}

export interface SmartList {
  id: string;
  name: string;
  items: CartItem[];
  type: 'manual' | 'ai_suggestion' | 'history';
  timesPurchased: number;
  totalSaved: number;
  createdAt: Date;
  tags?: string[]; // e.g. ["Churrasco", "Fim de Semana"]
}

// --- REFERRAL TYPES ---

export interface ReferralHistoryItem {
  id: string;
  name: string; // Name of referred person
  status: 'pending' | 'completed'; // Pending action vs Action completed
  date: string;
  rewardAmount: number;
}

export interface ReferralStats {
  code: string;
  totalEarnings: number;
  inviteCount: number;
  history: ReferralHistoryItem[];
}

// --- CASHBACK TYPES ---

export interface CashbackTransaction {
  id: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
}

// --- GAMIFICATION TYPES ---

export type CustomerLevel = 'Bronze' | 'Prata' | 'Ouro' | 'Platina';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  municipality: string;
  address?: string;
  cpf?: string;
  profile: GamificationProfile;
  referralCode?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: number; // points
  icon: string;
  completed: boolean;
  type: 'order_count' | 'spend' | 'review' | 'referral';
}

export interface GamificationProfile {
  points: number;
  level: CustomerLevel;
  lifetimeSavings: number;
  streakDays: number;
  missions: Mission[];
  weeklyPurchases?: number; // For "Buy 3x week" benefit
}

// --- VENDOR TYPES ---

export type VendorLevel = 'Bronze' | 'Prata' | 'Ouro' | 'Platina';

export interface VendorProfile {
  level: VendorLevel;
  points: number;
  ordersMonth: number;
  rating: number;
  engagementScore: number;
  activeBenefits: string[];
}

export interface Vendor {
  id: string;
  name: string; // Store Name
  ownerName: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  municipality: Municipality;
  deliveryType: 'own' | 'platform' | 'hybrid';
  profile: VendorProfile;
  referralCode?: string;
}

// --- FINANCIAL TYPES ---

export interface FinancialGoal {
  annualTarget: number;
  currentRevenue: number;
  lastMonthRevenue: number;
}

export interface RevenueStream {
  source: 'Clientes' | 'Entregadores' | 'Logistas';
  amount: number;
  percentage: number;
  details: string[]; // e.g. ["Taxa de Adesão", "Comissão 10%"]
}

// --- REVIEW TYPES ---

export interface Review {
  id: string;
  orderId: string;
  rating: number; // 1-5
  comment: string;
  reviewerRole: 'client' | 'driver';
  targetRole: 'market' | 'driver' | 'client';
  targetName: string; // Name of who is being reviewed
  createdAt: Date;
}