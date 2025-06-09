import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from("tokens")
      .select(
        `
        *,
        token_market_data (
          current_supply,
          current_price_usd,
          market_cap_usd,
          volume_24h,
          graduated_to_dex
        )
      `
      )
      .order("token_market_data(market_cap_usd)", { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    // Calculate buy/sell counts from transactions
    const { data: transactions, error: txError } = await supabase
      .from("token_transactions")
      .select("transaction_type")
      .eq("token_id", data.id)
      .gte(
        "created_at",
        new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      );

    if (txError) throw txError;

    const buyCount = transactions.filter(
      (tx) => tx.transaction_type === "buy"
    ).length;
    const sellCount = transactions.filter(
      (tx) => tx.transaction_type === "sell"
    ).length;

    // Mock price change for now
    const priceChange24h = Math.random() * 40 - 20; // Random between -20% and +20%

    const kingToken = {
      ...data,
      buy_count: buyCount,
      sell_count: sellCount,
      price_change_24h: priceChange24h,
      latest_price: data.token_market_data?.current_price_usd || 0,
    };

    return NextResponse.json({ success: true, data: kingToken });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
