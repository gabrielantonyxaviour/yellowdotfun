// app/api/tokens/[tokenId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { calculateTokenPrice } from "@/lib/pricing";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { tokenId: string } }
) {
  const tokenId = params.tokenId;

  const { data: token } = await supabase
    .from("tokens")
    .select("*")
    .eq("id", tokenId)
    .single();

  if (!token) {
    return NextResponse.json({ error: "Token not found" }, { status: 404 });
  }

  // Get transactions for current supply and price calculation
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("token_id", tokenId)
    .order("timestamp", { ascending: true });

  const currentSupply =
    transactions?.reduce((sum, tx) => {
      return tx.action === "BUY"
        ? sum + Number(tx.token_amount)
        : sum - Number(tx.token_amount);
    }, 0) || 0;

  const currentPrice = calculateTokenPrice({
    liquidityAmount: Number(token.liquidity_amount),
    totalSupply: Number(token.total_supply),
    currentSupply,
  });

  return NextResponse.json({
    ...token,
    currentSupply,
    currentPrice,
    transactions: transactions || [],
  });
}
