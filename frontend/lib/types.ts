export interface Token {
  id: string;
  name: string;
  symbol: string;
  emoji?: string;
  description?: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  holders?: number;
  rank?: number;
  createdAt: string;
  creatorAddress: string;
  contractAddress: string;
  chainId: number;
}

export interface ChartData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Transaction {
  id: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  from: string;
  to: string;
  timestamp: string;
  txHash: string;
}

export interface Holder {
  address: string;
  balance: number;
  percentage: number;
}
