import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);
const VIRTUAL_USD_RESERVES = 30000;
const VIRTUAL_TOKEN_RESERVES = 1073000000;

export async function POST(request: NextRequest) {
  try {
    const { token_id, usd_amount, token_amount, action } = await request.json();

    const { data: marketData, error: marketError } = await supabase
      .from("token_market_data")
      .select("current_supply")
      .eq("token_id", token_id)
      .single();

    if (marketError) throw marketError;

    const { data: tokenData, error: tokenError } = await supabase
      .from("tokens")
      .select("liquidity_amount")
      .eq("id", token_id)
      .single();

    if (tokenError) throw tokenError;

    const availableTokens = VIRTUAL_TOKEN_RESERVES - marketData.current_supply;
    const effectiveUsdReserves =
      VIRTUAL_USD_RESERVES + tokenData.liquidity_amount;

    let result;
    if (action === "buy" && usd_amount) {
      const netUsdAmount = usd_amount * 0.99; // 1% fee
      const k = effectiveUsdReserves * availableTokens;
      const newUsdReserves = effectiveUsdReserves + netUsdAmount;
      const newTokenReserves = k / newUsdReserves;
      const tokenAmount = availableTokens - newTokenReserves;

      result = { tokenAmount, price: netUsdAmount / tokenAmount };
    } else if (action === "sell" && token_amount) {
      const k = effectiveUsdReserves * availableTokens;
      const newTokenReserves = availableTokens + token_amount;
      const newUsdReserves = k / newTokenReserves;
      const grossUsdAmount = effectiveUsdReserves - newUsdReserves;
      const usdAmount = grossUsdAmount * 0.99; // 1% fee

      result = { usdAmount, price: grossUsdAmount / token_amount };
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
