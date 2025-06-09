import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const VIRTUAL_USD_RESERVES = 30000;
const VIRTUAL_TOKEN_RESERVES = 1073000000;
const PLATFORM_FEE_BPS = 100;

function calculateBuyTokenAmount(
  usdAmount: number,
  currentSupply: number,
  liquidityAmount: number
) {
  const netUsdAmount = usdAmount * (1 - PLATFORM_FEE_BPS / 10000);
  const platformFee = usdAmount - netUsdAmount;

  const availableTokens = VIRTUAL_TOKEN_RESERVES - currentSupply;
  const effectiveUsdReserves = VIRTUAL_USD_RESERVES + liquidityAmount;

  const k = effectiveUsdReserves * availableTokens;
  const newUsdReserves = effectiveUsdReserves + netUsdAmount;
  const newTokenReserves = k / newUsdReserves;

  const tokenAmount = availableTokens - newTokenReserves;
  const finalPrice = netUsdAmount / tokenAmount;

  return { tokenAmount, finalPrice, platformFee };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { token_id, user_address, usd_amount } = await request.json();

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

    const { tokenAmount, finalPrice, platformFee } = calculateBuyTokenAmount(
      usd_amount,
      marketData.current_supply,
      tokenData.liquidity_amount
    );

    // Execute buy transaction
    const { error } = await supabase.rpc("execute_buy_transaction", {
      p_token_id: token_id,
      p_user_address: user_address,
      p_token_amount: tokenAmount,
      p_usd_amount: usd_amount,
      p_price_per_token: finalPrice,
      p_platform_fee_usd: platformFee,
    });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      tokenAmount,
      finalPrice,
      platformFee,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
