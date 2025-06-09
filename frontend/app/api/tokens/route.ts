import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const sortBy = searchParams.get("sortBy") || "created_at";
    const order = searchParams.get("order") || "desc";

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
      .order(sortBy, { ascending: order === "asc" })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
