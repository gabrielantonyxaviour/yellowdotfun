import { createPublicClient, createWalletClient, custom, http } from "viem";
import { flowMainnet, flowTestnet } from "viem/chains";

export const isTesting = JSON.parse(
  process.env.NEXT_PUBLIC_TESTING_CHAIN || "false"
);

export const publicClient = createPublicClient({
  chain: isTesting ? flowTestnet : flowMainnet,
  transport: http(),
});

export const walletClient = createWalletClient({
  chain: isMainnet ? flowMainnet : flowTestnet,
  transport: custom(window.ethereum),
});
