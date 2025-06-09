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
      .order("token_market_data(volume_24h)", { ascending: false })
      .limit(10);

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
