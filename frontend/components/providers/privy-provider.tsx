"use client"

import type React from "react"

import { PrivyProvider } from "@privy-io/react-auth"
import { createConfig } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
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
} from "viem/chains"
import { http } from "wagmi/connectors"

const isMainnet = process.env.NEXT_PUBLIC_USE_MAINNET === "true"

const chains = isMainnet
  ? [mainnet, polygon, avalanche, bsc, base]
  : [sepolia, polygonAmoy, avalancheFuji, bscTestnet, baseSepolia]

// Fix: Remove WagmiProvider import and use createConfig correctly
const wagmiConfig = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [avalanche.id]: http(),
    [bsc.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
    [polygonAmoy.id]: http(),
    [avalancheFuji.id]: http(),
    [bscTestnet.id]: http(),
    [baseSepolia.id]: http(),
  },
})

const queryClient = new QueryClient()

export function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
        config={{
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
          walletConnectCloudProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
        }}
      >
        {children}
      </PrivyProvider>
    </QueryClientProvider>
  )
}
