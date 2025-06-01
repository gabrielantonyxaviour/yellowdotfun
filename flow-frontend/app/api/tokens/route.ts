// app/api/tokens/route.ts
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

interface CreateTokenRequest {
  token_name: string;
  token_symbol: string;
  token_image?: string;
  creator_allocation?: number;
  initial_liquidity_amount: number;
  twitter?: string;
  telegram?: string;
  website?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateTokenRequest = await request.json();

    const { data, error } = await supabase
      .from("tokens")
      .insert({
        token_name: body.token_name,
        token_symbol: body.token_symbol,
        token_image: body.token_image,
        creator_allocation: body.creator_allocation || 0,
        initial_liquidity_amount: body.initial_liquidity_amount,
        twitter: body.twitter,
        telegram: body.telegram,
        website: body.website,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
