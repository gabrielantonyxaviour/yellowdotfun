// app/api/one-inch/status/route.ts
import { NextRequest } from "next/server";
import {
  FusionSDK,
  NetworkEnum,
  PrivateKeyProviderConnector,
  Web3Like,
} from "@1inch/fusion-sdk";
import { ethers } from "ethers";

interface StatusRequestBody {
  orderHash: string;
  apiToken: string;
  nodeUrl: string;
}

export async function POST(request: NextRequest) {
  try {
    const { orderHash, apiToken, nodeUrl } =
      (await request.json()) as StatusRequestBody;

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
      "0x" + "0".repeat(64),
      ethersProviderConnector
    ); // dummy key for status check
    const sdk = new FusionSDK({
      url: "https://api.1inch.dev/fusion",
      network: NetworkEnum.BINANCE,
      blockchainProvider: connector,
      authKey: apiToken,
    });

    const data = await sdk.getOrderStatus(orderHash);
    return Response.json(data);
  } catch (error: unknown) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
