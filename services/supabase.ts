
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// SECURITY UPDATE: Keys must be loaded from environment variables.
// In a Vite environment use import.meta.env.VITE_SUPABASE_URL
// In Next.js use process.env.NEXT_PUBLIC_SUPABASE_URL
// In Create React App use process.env.REACT_APP_SUPABASE_URL

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials missing. Realtime features will be disabled. Check your .env file.');
}

// Only initialize if keys are present to prevent "Uncaught Error: supabaseUrl is required"
export const supabase: SupabaseClient | null = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Product Types matching DB
export interface DBProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image_url?: string;
}

// Fetch initial products
export const getRealtimeProducts = async (): Promise<DBProduct[] | null> => {
  if (!supabase || !supabaseUrl) return null;

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.warn('Supabase: Table not found or connection failed. Switching to Demo Mode.');
      return null;
    }
    return data as DBProduct[];
  } catch (err) {
    console.warn('Supabase: Unexpected error (Demo Mode activated):', err);
    return null;
  }
};

// Update stock or price
export const updateProductStock = async (id: string, newStock: number) => {
  if (!supabase) return;
  const { error } = await supabase
    .from('products')
    .update({ stock: newStock })
    .eq('id', id);
  
  if (error) console.error('Error updating stock:', error.message);
};

export const updateProductPrice = async (id: string, newPrice: number) => {
  if (!supabase) return;
  const { error } = await supabase
    .from('products')
    .update({ price: newPrice })
    .eq('id', id);
  
  if (error) console.error('Error updating price:', error.message);
};

// Subscribe to changes (Real-time magic)
export const subscribeToProducts = (callback: (payload: any) => void) => {
  if (!supabase) return { unsubscribe: () => {} }; // Mock subscription if no config

  return supabase
    .channel('custom-all-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
};
