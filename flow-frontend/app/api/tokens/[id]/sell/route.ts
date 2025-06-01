// app/api/tokens/[tokenId]/sell/route.ts
import { NextRequest, NextResponse } from "next/server";
import { calculateSellReturn } from "@/lib/pricing";
import { supabase } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: { tokenId: string } }
) {
  try {
    const { tokenAmount, userAddress } = await request.json();
    const tokenId = params.tokenId;

    // Check user balance
    const { data: balance } = await supabase
      .from("token_balances")
      .select("balance")
      .eq("token_id", tokenId)
      .eq("user_address", userAddress)
      .single();

    if (!balance || Number(balance.balance) < tokenAmount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Get token and calculate current supply
    const { data: token } = await supabase
      .from("tokens")
      .select("*")
      .eq("id", tokenId)
      .single();

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

    // Calculate sell return
    const { returnAmount, newPrice, avgPrice } = calculateSellReturn(
      {
        liquidityAmount: Number(token.liquidity_amount),
        totalSupply: Number(token.total_supply),
        currentSupply,
      },
      tokenAmount
    );

    // Create sell transaction
    const { data: transaction, error: txError } = await supabase
      .from("transactions")
      .insert({
        token_id: tokenId,
        action: "SELL",
        token_amount: tokenAmount,
        usd_amount: returnAmount,
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

    const newBalance = Number(balance.balance) - tokenAmount;
    const { error: balanceError } = await supabase
      .from("token_balances")
      .update({ balance: newBalance })
      .eq("token_id", tokenId)
      .eq("user_address", userAddress);

    return NextResponse.json({
      transaction,
      returnAmount,
      newPrice,
      avgPrice,
      currentSupply: currentSupply - tokenAmount,
    });
  } catch (error) {
    return NextResponse.json({ error: "Sale failed" }, { status: 500 });
  }
}
