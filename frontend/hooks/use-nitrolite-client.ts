import { useState, useEffect, useCallback } from "react";
import { NitroliteClient } from "@erc7824/nitrolite";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { ethers } from "ethers";

export const useNitroliteClient = () => {
  const [client, setClient] = useState<NitroliteClient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const initializeClient = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const address = accounts[0];
      setWalletAddress(address);

      const contractAddresses = {
        custody: process.env.NEXT_PUBLIC_CUSTODY_ADDRESS!,
        adjudicator: process.env.NEXT_PUBLIC_ADJUDICATOR_ADDRESS!,
        guestAddress: process.env.NEXT_PUBLIC_GUEST_ADDRESS!,
        tokenAddress: process.env.NEXT_PUBLIC_TOKEN_ADDRESS!,
      };

      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(process.env.NEXT_PUBLIC_RPC_URL!),
      });

      const walletClient = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum),
        account: address,
      });

      let stateWalletPrivateKey = localStorage.getItem(
        "nitrolite_state_wallet_key"
      );
      if (!stateWalletPrivateKey) {
        stateWalletPrivateKey = generatePrivateKey();
        localStorage.setItem(
          "nitrolite_state_wallet_key",
          stateWalletPrivateKey
        );
      }

      const stateWalletAccount = privateKeyToAccount(stateWalletPrivateKey);
      const stateWalletClient = {
        account: { address: stateWalletAccount.address },
        signMessage: async ({ message: { raw } }: any) => {
          const wallet = new ethers.Wallet(stateWalletPrivateKey!);
          const { serialized: signature } = wallet.signingKey.sign(raw);
          return signature;
        },
      };

      const nitroliteClient = new NitroliteClient({
        publicClient,
        walletClient,
        stateWalletClient,
        account: walletClient.account,
        chainId: sepolia.id,
        challengeDuration: 86400,
        addresses: contractAddresses,
      });

      setClient(nitroliteClient);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    client,
    loading,
    error,
    walletAddress,
    initializeClient,
  };
};
