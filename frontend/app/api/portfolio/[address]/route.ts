import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from("user_token_balances")
      .select(
        `
        token_id,
        balance,
        tokens:token_id (
          token_name,
          token_symbol,
          token_image
        ),
        token_market_data:token_id (
          current_price_usd,
          market_cap_usd
        )
      `
      )
      .eq("user_address", address)
      .gt("balance", 0);

    if (error) throw error;

    const portfolio = data.map((item: any) => ({
      ...item,
      value_usd:
        item.balance * (item.token_market_data?.current_price_usd || 0),
    }));

    const totalValue = portfolio.reduce((sum, item) => sum + item.value_usd, 0);

    return NextResponse.json({
      success: true,
      data: portfolio,
      totalValue,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
