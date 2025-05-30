import { type NextRequest, NextResponse } from "next/server"
import { authenticatePrivyUser } from "@/lib/api/auth"

export async function GET(req: NextRequest) {
  const authResult = await authenticatePrivyUser(req)

  if (!authResult.authenticated) {
    console.log(`Authentication failed: ${authResult.error}`)
    return NextResponse.json({ success: false, message: authResult.error }, { status: 401 })
  }

  // Mock data for recent tokens
  const tokens = [
    {
      id: "5",
      name: "Pizza Token",
      symbol: "PIZZA",
      emoji: "🍕",
      price: 0.0012,
      priceChange24h: 0,
      marketCap: 120000,
      volume24h: 12000,
      holders: 123,
      rank: 5,
      createdAt: new Date().toISOString(),
      creatorAddress: "0x5678...9abc",
      contractAddress: "0xefgh...ijkl",
      chainId: 1,
    },
    {
      id: "6",
      name: "Rainbow Coin",
      symbol: "RAINBOW",
      emoji: "🌈",
      price: 0.0034,
      priceChange24h: 0,
      marketCap: 340000,
      volume24h: 34000,
      holders: 234,
      rank: 6,
      createdAt: new Date().toISOString(),
      creatorAddress: "0x6789...abcd",
      contractAddress: "0xfghi...jklm",
      chainId: 1,
    },
    {
      id: "7",
      name: "Unicorn Token",
      symbol: "UNI",
      emoji: "🦄",
      price: 0.0056,
      priceChange24h: 0,
      marketCap: 560000,
      volume24h: 56000,
      holders: 345,
      rank: 7,
      createdAt: new Date().toISOString(),
      creatorAddress: "0x789a...bcde",
      contractAddress: "0xghij...klmn",
      chainId: 1,
    },
    {
      id: "8",
      name: "Star Coin",
      symbol: "STAR",
      emoji: "⭐",
      price: 0.0078,
      priceChange24h: 0,
      marketCap: 780000,
      volume24h: 78000,
      holders: 456,
      rank: 8,
      createdAt: new Date().toISOString(),
      creatorAddress: "0x89ab...cdef",
      contractAddress: "0xhijk...lmno",
      chainId: 1,
    },
  ]

  return NextResponse.json({ success: true, tokens })
}
