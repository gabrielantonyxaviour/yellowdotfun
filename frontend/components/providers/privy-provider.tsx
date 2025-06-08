"use client";

import type React from "react";

import { PrivyProvider } from "@privy-io/react-auth";
import { flowMainnet } from "viem/chains";
import { WagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "@/lib/wagmi-config";

const queryClient = new QueryClient();

export function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        supportedChains: [flowMainnet],
        defaultChain: flowMainnet,
        appearance: {
          theme: "dark",
          accentColor: "#FFD700",
          logo: "/logo.png",
        },
        loginMethods: ["wallet", "email"],
        fundingMethodConfig: {
          moonpay: {
            useSandbox: false,
          },
        },
        walletConnectCloudProjectId:
          process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
