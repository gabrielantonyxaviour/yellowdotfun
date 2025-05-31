"use client";

import { useState, useCallback, useEffect } from "react";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { flowTestnet, polygon } from "viem/chains";
import { nitroliteService } from "@/lib/nitrolite/service";
import { NITROLITE_CONFIG } from "@/lib/nitrolite/config";
import type { NitroliteClientConfig } from "@erc7824/nitrolite";
import { privateKeyToAccount } from "viem/accounts";

export function useNitrolite() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialize = useCallback(async (userAddress: string) => {
    try {
      setLoading(true);
      setError(null);

      const publicClient = createPublicClient({
        chain: flowTestnet,
        transport: http(),
      });

      const walletClient = createWalletClient({
        chain: flowTestnet,
        transport: custom(window.ethereum),
        account: userAddress as `0x${string}`,
      });

      const stateWalletClient = createWalletClient({
        chain: flowTestnet,
        transport: http(),
        account: privateKeyToAccount(
          process.env.NEXT_PUBLIC_STATE_PRIVATE_KEY as `0x${string}`
        ),
      });

      console.log("config params");
      console.log({
        addresses: NITROLITE_CONFIG.addresses,
        challengeDuration: NITROLITE_CONFIG.challengeDuration,
        chainId: NITROLITE_CONFIG.chainId,
      });

      const config: NitroliteClientConfig = {
        publicClient,
        walletClient,
        stateWalletClient,
        addresses: NITROLITE_CONFIG.addresses,
        challengeDuration: NITROLITE_CONFIG.challengeDuration,
        chainId: NITROLITE_CONFIG.chainId,
      };

      await nitroliteService.initialize(config);
      setIsInitialized(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createChannel = useCallback(async (depositAmount: bigint) => {
    try {
      setLoading(true);
      setError(null);
      return await nitroliteService.createChannel(depositAmount);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    initialize,
    createChannel,
    isInitialized,
    loading,
    error,
    service: nitroliteService,
  };
}

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const connect = useCallback(async () => {
    if (!window.ethereum) throw new Error("No wallet found");

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log("accounts", accounts);
    setAddress(accounts[0]);
    setConnected(true);
    return accounts[0];
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setConnected(false);
  }, []);

  useEffect(() => {
    (async function () {
      if (!window.ethereum) throw new Error("No wallet found");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length === 0) {
        setConnected(false);
        return;
      } else {
        console.log("accounts", accounts);
        setAddress(accounts[0]);
        setConnected(true);
      }
    })();
  }, []);

  return { address, connected, connect, disconnect };
}
