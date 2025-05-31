import { createPublicClient, createWalletClient, custom, http } from "viem";
import { flowMainnet, worldchain } from "viem/chains";

export const isTesting = JSON.parse(
  process.env.NEXT_PUBLIC_TESTING_CHAIN || "false"
);

export const publicClient = createPublicClient({
  chain: isTesting ? worldchain : flowMainnet,
  transport: http(),
});

export const walletClient = createWalletClient({
  chain: isTesting ? worldchain : flowMainnet,
  transport: custom(window.ethereum),
});

export const DEFAULT_EXPIRY = Math.floor(Date.now() / 1000) + 3600;
