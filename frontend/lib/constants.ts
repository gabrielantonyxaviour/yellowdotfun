import { createPublicClient, createWalletClient, custom, http } from "viem";
import { flowMainnet, flowTestnet } from "viem/chains";

export const isMainnet = process.env.NEXT_PUBLIC_USE_MAINNET === "true";

export const publicClient = createPublicClient({
  chain: isMainnet ? flowMainnet : flowTestnet,
  transport: http(),
});

export const walletClient = createWalletClient({
  chain: isMainnet ? flowMainnet : flowTestnet,
  transport: custom(window.ethereum),
});
