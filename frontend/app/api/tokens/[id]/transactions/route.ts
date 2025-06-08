import { type NextRequest, NextResponse } from "next/server"
import { authenticatePrivyUser } from "@/lib/api/auth"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await authenticatePrivyUser(req)

  if (!authResult.authenticated) {
    return NextResponse.json({ success: false, message: authResult.error }, { status: 401 })
  }

  // Mock transactions data
  const transactions = [
    {
      id: "1",
      type: "buy",
      amount: 10000,
      price: 0.0234,
      from: "0x1234567890123456789012345678901234567890",
      to: "0x2345678901234567890123456789012345678901",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    },
    {
      id: "2",
      type: "sell",
      amount: 5000,
      price: 0.0236,
      from: "0x3456789012345678901234567890123456789012",
      to: "0x4567890123456789012345678901234567890123",
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      txHash: "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
    },
    {
      id: "3",
      type: "buy",
      amount: 20000,
      price: 0.0232,
      from: "0x5678901234567890123456789012345678901234",
      to: "0x6789012345678901234567890123456789012345",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      txHash: "0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234",
    },
    {
      id: "4",
      type: "sell",
      amount: 15000,
      price: 0.0238,
      from: "0x7890123456789012345678901234567890123456",
      to: "0x8901234567890123456789012345678901234567",
      timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    },
  ]

  return NextResponse.json({ success: true, transactions })
}
