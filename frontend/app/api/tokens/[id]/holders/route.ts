import { type NextRequest, NextResponse } from "next/server"
import { authenticatePrivyUser } from "@/lib/api/auth"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await authenticatePrivyUser(req)

  if (!authResult.authenticated) {
    return NextResponse.json({ success: false, message: authResult.error }, { status: 401 })
  }

  // Mock holders data
  const holders = [
    {
      address: "0x1234567890123456789012345678901234567890",
      balance: 1000000,
      percentage: 25.5,
    },
    {
      address: "0x2345678901234567890123456789012345678901",
      balance: 750000,
      percentage: 19.1,
    },
    {
      address: "0x3456789012345678901234567890123456789012",
      balance: 500000,
      percentage: 12.7,
    },
    {
      address: "0x4567890123456789012345678901234567890123",
      balance: 250000,
      percentage: 6.4,
    },
    {
      address: "0x5678901234567890123456789012345678901234",
      balance: 100000,
      percentage: 2.5,
    },
  ]

  return NextResponse.json({ success: true, holders })
}
