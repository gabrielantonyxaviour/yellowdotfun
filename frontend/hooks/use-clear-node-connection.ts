import { useState, useCallback, useRef } from "react";
import { ethers } from "ethers";
import {
  createAuthRequestMessage,
  createAuthVerifyMessage,
  createGetChannelsMessage,
  createGetLedgerBalancesMessage,
} from "@erc7824/nitrolite";

export const useClearNodeConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected" | "authenticated"
  >("disconnected");
  const [error, setError] = useState<string | null>(null);
  const [channels, setChannels] = useState<any[]>([]);
  const [balances, setBalances] = useState<any>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const stateWalletRef = useRef<any>(null);

  const messageSigner = useCallback(async (payload: any) => {
    if (!stateWalletRef.current) throw new Error("State wallet not available");

    const message = JSON.stringify(payload);
    const digestHex = ethers.id(message);
    const messageBytes = ethers.getBytes(digestHex);
    const { serialized: signature } =
      stateWalletRef.current.signingKey.sign(messageBytes);
    return signature;
  }, []);

  const connect = useCallback(
    async (clearNodeUrl: string, stateWallet: any) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) return;

      stateWalletRef.current = stateWallet;
      setConnectionStatus("connecting");
      setError(null);

      const ws = new WebSocket(clearNodeUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        setConnectionStatus("connected");

        try {
          const authRequest = await createAuthRequestMessage(
            messageSigner,
            stateWallet.address
          );
          ws.send(authRequest);
        } catch (err) {
          setError(
            `Auth request failed: ${
              err instanceof Error ? err.message : "Unknown error"
            }`
          );
        }
      };

      ws.onmessage = async (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.res && message.res[1] === "auth_challenge") {
            const authVerify = await createAuthVerifyMessage(
              messageSigner,
              message,
              stateWallet.address
            );
            ws.send(authVerify);
          } else if (message.res && message.res[1] === "auth_success") {
            setConnectionStatus("authenticated");
          } else if (message.res && message.res[1] === "auth_failure") {
            setError(`Authentication failed: ${message.res[2]}`);
          } else if (message.res && message.res[1] === "get_channels") {
            setChannels(message.res[2][0] || []);
          } else if (message.res && message.res[1] === "get_ledger_balances") {
            setBalances(message.res[2]);
          }
        } catch (err) {
          console.error("Error handling message:", err);
        }
      };

      ws.onerror = () => {
        setError("WebSocket connection error");
        setConnectionStatus("disconnected");
      };

      ws.onclose = () => {
        setConnectionStatus("disconnected");
      };
    },
    [messageSigner]
  );

  const getChannels = useCallback(async () => {
    if (!wsRef.current || !stateWalletRef.current) return;

    const message = await createGetChannelsMessage(
      messageSigner,
      stateWalletRef.current.address
    );
    wsRef.current.send(message);
  }, [messageSigner]);

  const getLedgerBalances = useCallback(
    async (participant: string) => {
      if (!wsRef.current) return;

      const message = await createGetLedgerBalancesMessage(
        messageSigner,
        participant as `0x${string}`
      );
      wsRef.current.send(message);
    },
    [messageSigner]
  );

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnectionStatus("disconnected");
  }, []);

  return {
    connectionStatus,
    error,
    channels,
    balances,
    connect,
    getChannels,
    getLedgerBalances,
    disconnect,
  };
};
