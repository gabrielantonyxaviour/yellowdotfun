import { useState, useCallback } from "react";
import { NitroliteClient } from "@erc7824/nitrolite";

export const useChannelOperations = (client: NitroliteClient | null) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [channelData, setChannelData] = useState<any>(null);
  const [accountInfo, setAccountInfo] = useState<any>(null);

  const depositAndCreateChannel = useCallback(
    async (amount: bigint) => {
      if (!client) throw new Error("Client not initialized");

      setLoading(true);
      setError(null);

      try {
        const participants = [
          client.account.address as `0x${string}`,
          client.addresses.guestAddress as `0x${string}`,
        ];

        const channelParams = {
          participants,
          amounts: [amount, BigInt(0)],
          tokenAddress: client.addresses.tokenAddress as `0x${string}`,
          challengePeriod: client.challengeDuration,
          nonce: BigInt(Date.now()),
        };

        const result = await client.depositAndCreateChannel(
          amount,
          channelParams
        );

        localStorage.setItem("nitrolite_channel_id", result.channelId);
        setChannelData(result);

        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  const getAccountInfo = useCallback(async () => {
    if (!client) return null;

    try {
      const info = await client.getAccountInfo();
      setAccountInfo(info);
      return info;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to get account info"
      );
      return null;
    }
  }, [client]);

  const getTokenBalance = useCallback(async () => {
    if (!client) return null;

    try {
      return await client.getTokenBalance();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to get token balance"
      );
      return null;
    }
  }, [client]);

  const deposit = useCallback(
    async (amount: bigint) => {
      if (!client) throw new Error("Client not initialized");

      setLoading(true);
      try {
        const txHash = await client.deposit(amount);
        await getAccountInfo(); // Refresh account info
        return txHash;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Deposit failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [client, getAccountInfo]
  );

  const withdrawal = useCallback(
    async (amount: bigint) => {
      if (!client) throw new Error("Client not initialized");

      setLoading(true);
      try {
        const txHash = await client.withdrawal(amount);
        await getAccountInfo(); // Refresh account info
        return txHash;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Withdrawal failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [client, getAccountInfo]
  );

  return {
    loading,
    error,
    channelData,
    accountInfo,
    depositAndCreateChannel,
    getAccountInfo,
    getTokenBalance,
    deposit,
    withdrawal,
  };
};
