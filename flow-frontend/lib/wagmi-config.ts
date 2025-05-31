import { createConfig } from "@privy-io/wagmi";
import { http } from "viem";
import { flowMainnet, worldchain } from "viem/chains";
import { isTesting } from "@/lib/constants";

export const config = createConfig({
  chains: isTesting ? [worldchain] : [flowMainnet],
  transports: {
    [worldchain.id]: http(
      `https://worldchain-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
    [flowMainnet.id]: http(
      `https://worldchain-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  },
});
