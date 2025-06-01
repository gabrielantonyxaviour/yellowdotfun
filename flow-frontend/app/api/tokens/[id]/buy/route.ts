// app/api/tokens/[tokenId]/buy/route.ts
import { NextRequest, NextResponse } from "next/server";
import { calculatePurchaseCost } from "@/lib/pricing";
import { supabase } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: { tokenId: string } }
) {
  try {
    const { tokenAmount, userAddress } = await request.json();
    const tokenId = params.tokenId;

    // Get token info and current supply
    const { data: token } = await supabase
      .from("tokens")
      .select("*")
      .eq("id", tokenId)
      .single();

    if (!token) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }

    // Calculate current supply from transactions
    const { data: transactions } = await supabase
      .from("transactions")
      .select("action, token_amount")
      .eq("token_id", tokenId);

    const currentSupply =
      transactions?.reduce((sum, tx) => {
        return tx.action === "BUY"
          ? sum + Number(tx.token_amount)
          : sum - Number(tx.token_amount);
      }, 0) || 0;

    // Calculate purchase cost
    const { cost, newPrice, avgPrice } = calculatePurchaseCost(
      {
        liquidityAmount: Number(token.liquidity_amount),
        totalSupply: Number(token.total_supply),
        currentSupply,
      },
      tokenAmount
    );

    // Start transaction
    const { data: transaction, error: txError } = await supabase
      .from("transactions")
      .insert({
        token_id: tokenId,
        action: "BUY",
        token_amount: tokenAmount,
        usd_amount: cost,
        user_address: userAddress,
      })
      .select()
      .single();

    if (txError) {
      return NextResponse.json({ error: txError.message }, { status: 400 });
    }
    const { data: currentBalance } = await supabase
      .from("token_balances")
      .select("balance")
      .eq("token_id", tokenId)
      .eq("user_address", userAddress)
      .single();

    const newBalance = (Number(currentBalance?.balance) || 0) + tokenAmount;

    const { error: balanceError } = await supabase
      .from("token_balances")
      .upsert({
        token_id: tokenId,
        user_address: userAddress,
        balance: newBalance,
      });
    if (balanceError) {
      return NextResponse.json(
        { error: balanceError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      transaction,
      cost,
      newPrice,
      avgPrice,
      currentSupply: currentSupply + tokenAmount,
    });
  } catch (error) {
    return NextResponse.json({ error: "Purchase failed" }, { status: 500 });
  }
}
