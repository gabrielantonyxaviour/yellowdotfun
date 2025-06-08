import { NextResponse } from "next/server";

export async function GET() {
  // Return ClearNode configuration
  return NextResponse.json({
    url: process.env.CLEARNODE_URL || "wss://clearnode.example.com",
    supportedChains: ["sepolia"],
    features: ["auth", "channels", "app_sessions"],
  });
}
