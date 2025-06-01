// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Token {
  id: string;
  token_name: string;
  token_symbol: string;
  token_image?: string;
  creator_allocation: number;
  liquidity_amount: number;
  twitter?: string;
  telegram?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  token_id: string;
  action: "BUY" | "SELL";
  token_amount: number;
  usd_amount: number;
  user_address?: string;
  timestamp: string;
  created_at: string;
}
