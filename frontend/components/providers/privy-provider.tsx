"use client";

import type React from "react";

import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  mainnet,
  polygon,
  avalanche,
  bsc,
  base,
  sepolia,
  polygonAmoy,
  avalancheFuji,
  bscTestnet,
  baseSepolia,
} from "viem/chains";

const isMainnet = process.env.NEXT_PUBLIC_USE_MAINNET === "true";

const chains = isMainnet
  ? [mainnet, polygon, avalanche, bsc, base]
  : [sepolia, polygonAmoy, avalancheFuji, bscTestnet, baseSepolia];

const queryClient = new QueryClient();

export function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
        config={{
          supportedChains: chains,
          defaultChain: isMainnet ? mainnet : sepolia,
          appearance: {
            theme: "light",
            accentColor: "#FFD700",
            logo: "/logo.png",
          },
          loginMethods: ["wallet"],
          fundingMethodConfig: {
            moonpay: {
              useSandbox: !isMainnet,
            },
          },
          walletConnectCloudProjectId:
            process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
        }}
      >
        {children}
      </PrivyProvider>
    </QueryClientProvider>
  );
}
