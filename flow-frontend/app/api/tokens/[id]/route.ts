import { type NextRequest, NextResponse } from "next/server"
import { authenticatePrivyUser } from "@/lib/api/auth"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await authenticatePrivyUser(req)

  if (!authResult.authenticated) {
    console.log(`Authentication failed: ${authResult.error}`)
    return NextResponse.json({ success: false, message: authResult.error }, { status: 401 })
  }

  // Mock data for a single token
  const token = {
    id: params.id,
    name: "Moon Rocket",
    symbol: "MOON",
    emoji: "🚀",
    description:
      "To the moon! This is the most fun token in the galaxy. Join us on our journey to explore the crypto universe!",
    price: 0.0234,
    priceChange24h: 45.67,
    marketCap: 2340000,
    volume24h: 567000,
    holders: 1234,
    rank: 1,
    createdAt: new Date().toISOString(),
    creatorAddress: "0x1234...5678",
    contractAddress: "0xabcd...efgh",
    chainId: 1,
  }

  return NextResponse.json({ success: true, token })
}
