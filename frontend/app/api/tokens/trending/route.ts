import { type NextRequest, NextResponse } from "next/server"
import { authenticatePrivyUser } from "@/lib/api/auth"

export async function GET(req: NextRequest) {
  const authResult = await authenticatePrivyUser(req)

  if (!authResult.authenticated) {
    console.log(`Authentication failed: ${authResult.error}`)
    return NextResponse.json({ success: false, message: authResult.error }, { status: 401 })
  }

  // Mock data for trending tokens
  const tokens = [
    {
      id: "1",
      name: "Moon Rocket",
      symbol: "MOON",
      emoji: "🚀",
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
    },
    {
      id: "2",
      name: "Diamond Hands",
      symbol: "DIAMOND",
      emoji: "💎",
      price: 0.0567,
      priceChange24h: 23.45,
      marketCap: 5670000,
      volume24h: 890000,
      holders: 2345,
      rank: 2,
      createdAt: new Date().toISOString(),
      creatorAddress: "0x2345...6789",
      contractAddress: "0xbcde...fghi",
      chainId: 1,
    },
    {
      id: "3",
      name: "Banana Coin",
      symbol: "BANANA",
      emoji: "🍌",
      price: 0.0123,
      priceChange24h: -12.34,
      marketCap: 1230000,
      volume24h: 234000,
      holders: 567,
      rank: 3,
      createdAt: new Date().toISOString(),
      creatorAddress: "0x3456...789a",
      contractAddress: "0xcdef...ghij",
      chainId: 1,
    },
    {
      id: "4",
      name: "Fire Token",
      symbol: "FIRE",
      emoji: "🔥",
      price: 0.0789,
      priceChange24h: 67.89,
      marketCap: 7890000,
      volume24h: 1234000,
      holders: 3456,
      rank: 4,
      createdAt: new Date().toISOString(),
      creatorAddress: "0x4567...89ab",
      contractAddress: "0xdefg...hijk",
      chainId: 1,
    },
  ]

  return NextResponse.json({ success: true, tokens })
}
