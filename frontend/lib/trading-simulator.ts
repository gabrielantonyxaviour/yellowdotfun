// lib/trading-simulator.ts
"use client";

import { useTradingStore } from "./trading-store";

class TradingSimulator {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  // Generate realistic wallet addresses
  private generateAddress(): string {
    return (
      "0x" +
      Array.from({ length: 40 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("")
    );
  }

  // Generate realistic trading amounts
  private generateTradeAmount(isWhale: boolean = false): number {
    if (isWhale && Math.random() < 0.05) {
      // 5% chance of whale trade
      return 0.5 + Math.random() * 2; // 0.5-2.5 ETH
    }

    const patterns = [
      () => 0.001 + Math.random() * 0.01, // Small retail: 0.001-0.011 ETH
      () => 0.01 + Math.random() * 0.05, // Medium retail: 0.01-0.06 ETH
      () => 0.05 + Math.random() * 0.2, // Large retail: 0.05-0.25 ETH
    ];

    const weights = [0.7, 0.2, 0.1]; // 70% small, 20% medium, 10% large
    const rand = Math.random();
    let cumWeight = 0;

    for (let i = 0; i < weights.length; i++) {
      cumWeight += weights[i];
      if (rand <= cumWeight) {
        return patterns[i]();
      }
    }

    return patterns[0]();
  }

  // Simulate market sentiment
  private getMarketSentiment(token: any): "bullish" | "bearish" | "neutral" {
    const recentTrades = token.transactions.slice(0, 10);
    if (recentTrades.length < 3) return "neutral";

    const buyRatio =
      recentTrades.filter((tx: any) => tx.type === "buy").length /
      recentTrades.length;
    const priceChange =
      recentTrades.length > 1
        ? (recentTrades[0].newPrice -
            recentTrades[recentTrades.length - 1].newPrice) /
          recentTrades[recentTrades.length - 1].newPrice
        : 0;

    if (buyRatio > 0.7 && priceChange > 0.05) return "bullish";
    if (buyRatio < 0.3 && priceChange < -0.05) return "bearish";
    return "neutral";
  }

  // Generate transaction based on market conditions
  private generateTransaction(tokenId: string) {
    const store = useTradingStore.getState();
    const token = store.tokens[tokenId];
    if (!token) return;

    const sentiment = this.getMarketSentiment(token);
    const userAddress = this.generateAddress();

    // Sentiment-based trading probability
    let buyProbability = 0.5;
    switch (sentiment) {
      case "bullish":
        buyProbability = 0.75;
        break;
      case "bearish":
        buyProbability = 0.25;
        break;
    }

    const isBuy = Math.random() < buyProbability;

    if (isBuy) {
      // Buy transaction
      const ethAmount = this.generateTradeAmount();
      store.setUserBalance(userAddress, ethAmount * 1.1); // Give user slightly more ETH
      store.buyToken(tokenId, userAddress, ethAmount);
    } else {
      // Sell transaction - need to find existing holder
      const holders = Object.entries(token.holders);
      if (holders.length === 0) return;

      const [holderAddress, balance] =
        holders[Math.floor(Math.random() * holders.length)];
      const sellAmount = Math.min(
        balance,
        balance * (0.1 + Math.random() * 0.5)
      ); // Sell 10-60% of holdings

      if (sellAmount > 0) {
        store.sellToken(tokenId, holderAddress, sellAmount);
      }
    }
  }

  start(tokenIds: string[]) {
    if (this.isRunning) return;

    this.isRunning = true;
    useTradingStore.getState().startSimulation();

    // Start with higher frequency for demo
    this.intervalId = setInterval(() => {
      if (tokenIds.length === 0) return;

      // Generate 20 transactions per second across all tokens
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          const randomTokenId =
            tokenIds[Math.floor(Math.random() * tokenIds.length)];
          this.generateTransaction(randomTokenId);
        }, i * 50); // Spread across 1 second
      }
    }, 1000);
  }

  stop() {
    if (!this.isRunning) return;

    this.isRunning = false;
    useTradingStore.getState().stopSimulation();

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const tradingSimulator = new TradingSimulator();
