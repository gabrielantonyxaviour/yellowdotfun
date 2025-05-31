import {
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  bsc,
  bscTestnet,
  mainnet,
  polygon,
  polygonAmoy,
  sepolia,
} from "viem/chains";

export const isMainnet = process.env.NEXT_PUBLIC_USE_MAINNET === "true";

export const usdcAddresses = isMainnet
  ? {
      [mainnet.id]: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      [polygon.id]: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      [avalanche.id]: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      [bsc.id]: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
      [base.id]: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
    }
  : {
      [sepolia.id]: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      [polygonAmoy.id]: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      [avalancheFuji.id]: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      [bscTestnet.id]: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      [baseSepolia.id]: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    };
