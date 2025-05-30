import type { Hex } from "viem";

export const NITROLITE_CONFIG = {
  // WebSocket URLs
  BROKER_WS_URL:
    process.env.NEXT_PUBLIC_BROKER_WS_URL || "ws://localhost:8000/ws",

  // Contract addresses (using their actual deployed contracts)
  addresses: {
    custody: (process.env.NEXT_PUBLIC_CUSTODY_ADDRESS ||
      "0x1096644156Ed58BF596e67d35827Adc97A25D940") as Hex,
    adjudicator: (process.env.NEXT_PUBLIC_ADJUDICATOR_ADDRESS ||
      "0xa3f2f64455c9f8D68d9dCAeC2605D64680FaF898") as Hex,
    tokenAddress: (process.env.NEXT_PUBLIC_TOKEN_ADDRESS ||
      "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359") as Hex,
    guestAddress: (process.env.NEXT_PUBLIC_GUEST_ADDRESS ||
      "0x3c93C321634a80FB3657CFAC707718A11cA57cBf") as Hex,
  },

  // Chain config
  chainId: 545, // Flow Testnet
  challengeDuration: BigInt(100),
};
