// app/api/one-inch/order/route.ts
import { NextRequest } from "next/server";
import {
  FusionSDK,
  NetworkEnum,
  PrivateKeyProviderConnector,
  Web3Like,
} from "@1inch/fusion-sdk";
import { ethers } from "ethers";

interface OrderRequestBody {
  privateKey: string;
  nodeUrl: string;
  apiToken: string;
  fromToken: string;
  toToken: string;
  amount: string;
}

export async function POST(request: NextRequest) {
  try {
    const { privateKey, nodeUrl, apiToken, fromToken, toToken, amount } =
      (await request.json()) as OrderRequestBody;

    const ethersRpcProvider = new ethers.providers.JsonRpcProvider(nodeUrl);
    const ethersProviderConnector: Web3Like = {
      eth: {
        call(transactionConfig): Promise<string> {
          return ethersRpcProvider.call(transactionConfig);
        },
      },
      extend(): void {},
    };

    const connector = new PrivateKeyProviderConnector(
      privateKey,
      ethersProviderConnector
    );
    const sdk = new FusionSDK({
      url: "https://api.1inch.dev/fusion",
      network: NetworkEnum.BINANCE,
      blockchainProvider: connector,
      authKey: apiToken,
    });

    const params = {
      fromTokenAddress: fromToken,
      toTokenAddress: toToken,
      amount,
      walletAddress: ethers.utils.computeAddress(privateKey),
      source: "sdk-test",
    };

    const preparedOrder = await sdk.createOrder(params);
    const info = await sdk.submitOrder(
      preparedOrder.order,
      preparedOrder.quoteId
    );

    return Response.json({
      orderHash: info.orderHash,
      status: "Submitted",
    });
  } catch (error: unknown) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
