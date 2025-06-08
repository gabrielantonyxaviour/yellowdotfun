import { createConfig } from "@privy-io/wagmi";
import { http } from "viem";
import { flowMainnet, worldchain } from "viem/chains";

export const config = createConfig({
  chains: [flowMainnet],
  transports: {
    [flowMainnet.id]: http(
      `https://worldchain-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  },
});
