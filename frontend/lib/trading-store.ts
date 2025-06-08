// lib/trading-store.ts
"use client";

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface Token {
  id: string;
  name: string;
  symbol: string;
  description: string;
  totalSupply: number;
  virtualCollateral: number; // Virtual ETH reserves
  virtualTokenSupply: number; // Virtual token reserves
  realCollateral: number; // Real ETH collected
  holders: Record<string, number>; // address -> balance
  transactions: Transaction[];
  createdAt: number;
  creatorAddress: string;
}

export interface Transaction {
  id: string;
  tokenId: string;
  type: "buy" | "sell";
  from: string;
  amount: number; // token amount
  ethAmount: number; // ETH amount
  price: number; // price per token at time of trade
  timestamp: number;
  newPrice: number; // price after trade
}

interface TradingState {
  tokens: Record<string, Token>;
  userBalances: Record<string, number>; // ETH balances
  isSimulating: boolean;
}

interface TradingActions {
  createToken: (
    token: Omit<Token, "id" | "holders" | "transactions" | "createdAt">
  ) => string;
  buyToken: (
    tokenId: string,
    userAddress: string,
    ethAmount: number
  ) => boolean;
  sellToken: (
    tokenId: string,
    userAddress: string,
    tokenAmount: number
  ) => boolean;
  getTokenPrice: (tokenId: string) => number;
  startSimulation: () => void;
  stopSimulation: () => void;
  setUserBalance: (address: string, balance: number) => void;
}

// Bonding curve implementation using x*y=k formula
const calculateTokensForEth = (
  ethAmount: number,
  virtualEth: number,
  virtualTokens: number
): number => {
  // k = virtualEth * virtualTokens
  const k = virtualEth * virtualTokens;
  const newVirtualEth = virtualEth + ethAmount;
  const newVirtualTokens = k / newVirtualEth;
  return virtualTokens - newVirtualTokens;
};

const calculateEthForTokens = (
  tokenAmount: number,
  virtualEth: number,
  virtualTokens: number
): number => {
  const k = virtualEth * virtualTokens;
  const newVirtualTokens = virtualTokens + tokenAmount;
  const newVirtualEth = k / newVirtualTokens;
  return virtualEth - newVirtualEth;
};

const getCurrentPrice = (virtualEth: number, virtualTokens: number): number => {
  return virtualEth / virtualTokens;
};

export const useTradingStore = create<TradingState & TradingActions>()(
  subscribeWithSelector((set, get) => ({
    tokens: {},
    userBalances: {},
    isSimulating: false,

    createToken: (tokenData) => {
      const id = `token_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const token: Token = {
        ...tokenData,
        id,
        holders: {},
        transactions: [],
        createdAt: Date.now(),
      };

      set((state) => ({
        tokens: { ...state.tokens, [id]: token },
      }));

      return id;
    },

    getTokenPrice: (tokenId) => {
      const token = get().tokens[tokenId];
      if (!token) return 0;
      return getCurrentPrice(token.virtualCollateral, token.virtualTokenSupply);
    },

    setUserBalance: (address, balance) => {
      set((state) => ({
        userBalances: { ...state.userBalances, [address]: balance },
      }));
    },

    buyToken: (tokenId, userAddress, ethAmount) => {
      const state = get();
      const token = state.tokens[tokenId];
      const userEthBalance = state.userBalances[userAddress] || 0;

      if (!token || userEthBalance < ethAmount || ethAmount <= 0) {
        return false;
      }

      const tokensToReceive = calculateTokensForEth(
        ethAmount,
        token.virtualCollateral,
        token.virtualTokenSupply
      );

      if (tokensToReceive <= 0) return false;

      const newPrice = getCurrentPrice(
        token.virtualCollateral + ethAmount,
        token.virtualTokenSupply - tokensToReceive
      );

      const transaction: Transaction = {
        id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tokenId,
        type: "buy",
        from: userAddress,
        amount: tokensToReceive,
        ethAmount,
        price: getCurrentPrice(
          token.virtualCollateral,
          token.virtualTokenSupply
        ),
        timestamp: Date.now(),
        newPrice,
      };

      set((state) => ({
        tokens: {
          ...state.tokens,
          [tokenId]: {
            ...token,
            virtualCollateral: token.virtualCollateral + ethAmount,
            virtualTokenSupply: token.virtualTokenSupply - tokensToReceive,
            realCollateral: token.realCollateral + ethAmount,
            holders: {
              ...token.holders,
              [userAddress]:
                (token.holders[userAddress] || 0) + tokensToReceive,
            },
            transactions: [transaction, ...token.transactions].slice(0, 100), // Keep last 100
          },
        },
        userBalances: {
          ...state.userBalances,
          [userAddress]: userEthBalance - ethAmount,
        },
      }));

      return true;
    },

    sellToken: (tokenId, userAddress, tokenAmount) => {
      const state = get();
      const token = state.tokens[tokenId];
      const userTokenBalance = token?.holders[userAddress] || 0;

      if (!token || userTokenBalance < tokenAmount || tokenAmount <= 0) {
        return false;
      }

      const ethToReceive = calculateEthForTokens(
        tokenAmount,
        token.virtualCollateral,
        token.virtualTokenSupply
      );

      if (ethToReceive <= 0) return false;

      const newPrice = getCurrentPrice(
        token.virtualCollateral - ethToReceive,
        token.virtualTokenSupply + tokenAmount
      );

      const transaction: Transaction = {
        id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tokenId,
        type: "sell",
        from: userAddress,
        amount: tokenAmount,
        ethAmount: ethToReceive,
        price: getCurrentPrice(
          token.virtualCollateral,
          token.virtualTokenSupply
        ),
        timestamp: Date.now(),
        newPrice,
      };

      const newHolders = { ...token.holders };
      if (newHolders[userAddress] - tokenAmount <= 0) {
        delete newHolders[userAddress];
      } else {
        newHolders[userAddress] -= tokenAmount;
      }

      set((state) => ({
        tokens: {
          ...state.tokens,
          [tokenId]: {
            ...token,
            virtualCollateral: token.virtualCollateral - ethToReceive,
            virtualTokenSupply: token.virtualTokenSupply + tokenAmount,
            realCollateral: token.realCollateral - ethToReceive,
            holders: newHolders,
            transactions: [transaction, ...token.transactions].slice(0, 100),
          },
        },
        userBalances: {
          ...state.userBalances,
          [userAddress]: (state.userBalances[userAddress] || 0) + ethToReceive,
        },
      }));

      return true;
    },

    startSimulation: () => {
      set({ isSimulating: true });
    },

    stopSimulation: () => {
      set({ isSimulating: false });
    },
  }))
);
