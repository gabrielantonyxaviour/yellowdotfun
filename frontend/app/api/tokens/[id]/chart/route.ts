import { type NextRequest, NextResponse } from "next/server"
import { authenticatePrivyUser } from "@/lib/api/auth"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await authenticatePrivyUser(req)

  if (!authResult.authenticated) {
    console.log(`Authentication failed: ${authResult.error}`)
    return NextResponse.json({ success: false, message: authResult.error }, { status: 401 })
  }

  // Mock chart data
  const now = Date.now()
  const data = Array.from({ length: 100 }, (_, i) => {
    const time = new Date(now - (100 - i) * 3600000).toISOString()
    const basePrice = 0.02
    const volatility = 0.3
    const trend = 1 + (i / 100) * 0.5

    const open = basePrice * trend * (1 + (Math.random() - 0.5) * volatility)
    const close = basePrice * trend * (1 + (Math.random() - 0.5) * volatility)
    const high = Math.max(open, close) * (1 + Math.random() * 0.1)
    const low = Math.min(open, close) * (1 - Math.random() * 0.1)

    return {
      time,
      open,
      high,
      low,
      close,
      volume: Math.floor(Math.random() * 100000) + 10000,
    }
  })

  return NextResponse.json({ success: true, data })
}
