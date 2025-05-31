import { PrivyClient } from "@privy-io/server-auth"
import type { NextRequest } from "next/server"

const privy = new PrivyClient(process.env.NEXT_PUBLIC_PRIVY_APP_ID!, process.env.PRIVY_APP_SECRET!)

export async function authenticatePrivyUser(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { authenticated: false, error: "Missing or invalid authorization header" }
    }

    const token = authHeader.substring(7)

    const verifiedClaims = await privy.verifyAuthToken(token)
    const userId = verifiedClaims.userId

    if (!userId) {
      return { authenticated: false, error: "Invalid token claims (missing userId)" }
    }

    return {
      authenticated: true,
      userId,
      verifiedClaims,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return { authenticated: false, error: "Authentication failed" }
  }
}
