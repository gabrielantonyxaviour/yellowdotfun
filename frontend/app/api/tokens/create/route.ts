import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const body = await request.json();
    const {
      token_name,
      token_symbol,
      token_image,
      creator_allocation,
      liquidity_amount,
      twitter,
      telegram,
      website,
      creator_address,
    } = body;

    // Create token
    const { data: token, error: tokenError } = await supabase
      .from("tokens")
      .insert({
        token_name,
        token_symbol,
        token_image,
        creator_allocation,
        liquidity_amount,
        twitter,
        telegram,
        website,
      })
      .select()
      .single();

    if (tokenError) throw tokenError;

    // Initialize market data
    const creatorTokens = (creator_allocation / 100) * 1000000000;
    const initialSupply = creatorTokens;
    const availableTokens = 1073000000 - initialSupply;
    const initialPrice = (30000 + liquidity_amount) / availableTokens;

    const { error: marketError } = await supabase
      .from("token_market_data")
      .insert({
        token_id: token.id,
        current_supply: initialSupply,
        current_price_usd: initialPrice,
        market_cap_usd: initialSupply * initialPrice,
        volume_24h: 0,
      });

    if (marketError) throw marketError;

    // Give creator their allocation
    if (creator_allocation > 0 && creator_address) {
      const { error: balanceError } = await supabase
        .from("user_token_balances")
        .insert({
          user_address: creator_address,
          token_id: token.id,
          balance: creatorTokens,
        });

      if (balanceError) throw balanceError;
    }

    return NextResponse.json({ success: true, token });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
