import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const VIRTUAL_USD_RESERVES = 30000;
const VIRTUAL_TOKEN_RESERVES = 1073000000;
const PLATFORM_FEE_BPS = 100;

function calculateSellUsdAmount(
  tokenAmount: number,
  currentSupply: number,
  liquidityAmount: number
) {
  const availableTokens = VIRTUAL_TOKEN_RESERVES - currentSupply;
  const effectiveUsdReserves = VIRTUAL_USD_RESERVES + liquidityAmount;

  const k = effectiveUsdReserves * availableTokens;
  const newTokenReserves = availableTokens + tokenAmount;
  const newUsdReserves = k / newTokenReserves;

  const grossUsdAmount = effectiveUsdReserves - newUsdReserves;
  const platformFee = grossUsdAmount * (PLATFORM_FEE_BPS / 10000);
  const usdAmount = grossUsdAmount - platformFee;
  const finalPrice = grossUsdAmount / tokenAmount;

  return { usdAmount, finalPrice, platformFee };
}

export async function POST(request: NextRequest) {
  try {
    const { token_id, user_address, token_amount } = await request.json();

    // Check user balance
    const { data: balance, error: balanceError } = await supabase
      .from("user_token_balances")
      .select("balance")
      .eq("user_address", user_address)
      .eq("token_id", token_id)
      .single();

    if (balanceError || !balance || balance.balance < token_amount) {
      throw new Error("Insufficient token balance");
    }

    // Get current market data and liquidity amount
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

    const { usdAmount, finalPrice, platformFee } = calculateSellUsdAmount(
      token_amount,
      marketData.current_supply,
      tokenData.liquidity_amount
    );

    // Execute sell transaction
    const { error } = await supabase.rpc("execute_sell_transaction", {
      p_token_id: token_id,
      p_user_address: user_address,
      p_token_amount: token_amount,
      p_usd_amount: usdAmount,
      p_price_per_token: finalPrice,
      p_platform_fee_usd: platformFee,
    });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      usdAmount,
      finalPrice,
      platformFee,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
