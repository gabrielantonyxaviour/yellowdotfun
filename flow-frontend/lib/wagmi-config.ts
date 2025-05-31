import { createConfig } from "@privy-io/wagmi";
import { http } from "viem";
import { worldchain, worldchainSepolia } from "viem/chains";

export const config = createConfig({
  chains: [worldchain, worldchainSepolia],
  transports: {
    [worldchainSepolia.id]: http(
      `https://worldchain-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
    [worldchain.id]: http(
      `https://worldchain-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  },
});
