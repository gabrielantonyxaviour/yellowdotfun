// app/api/one-inch/quote/route.ts
import { NextRequest } from "next/server";
import {
  FusionSDK,
  NetworkEnum,
  Web3ProviderConnector,
  Web3Like,
} from "@1inch/fusion-sdk";

// Mock Web3Like for server-side quote (no signing needed)
const mockWeb3Provider: Web3Like = {
  eth: {
    call(): Promise<string> {
      return Promise.resolve("0x");
    },
  },
  extend(): void {},
};

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, apiToken, fromToken, toToken, amount } =
      await request.json();

    const connector = new Web3ProviderConnector(mockWeb3Provider);
    const sdk = new FusionSDK({
      url: "https://api.1inch.dev/fusion",
      network: NetworkEnum.BINANCE,
      blockchainProvider: connector,
      authKey: apiToken,
    });

    const quote = await sdk.getQuote({
      fromTokenAddress: fromToken,
      toTokenAddress: toToken,
      amount,
      walletAddress,
      source: "sdk-test",
    });

    return Response.json({
      auctionStartAmount:
        quote.presets[quote.recommendedPreset].auctionStartAmount,
      auctionEndAmount: quote.presets[quote.recommendedPreset].auctionEndAmount,
      presets: quote.presets,
      recommendedPreset: quote.recommendedPreset,
      quoteData: quote, // Store full quote for order creation
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
