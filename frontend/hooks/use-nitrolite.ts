// app/testing/yellow/hooks/useNitrolite.ts
import { useState, useCallback, useRef } from "react";
import { ethers } from "ethers";
import {
  createAuthRequestMessage,
  createAuthVerifyMessage,
  createAppSessionMessage,
  createCloseAppSessionMessage,
  NitroliteClient,
} from "@erc7824/nitrolite";
import { supabase } from "@/lib/supabase";
import { Address, createWalletClient, Hex, http, WalletClient } from "viem";
import { DEFAULT_EXPIRY, publicClient } from "@/lib/constants";
import { validateChallenge } from "@/lib/utils";
import { flowMainnet } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

interface Participant {
  address: string;
  joinedAt: number;
}

interface AppSession {
  id: string;
  status: string;
  participants: string[];
  createdAt: number;
}

interface Allocation {
  participant: Address;
  asset: string;
  amount: string;
}

export const useNitrolite = (
  address?: Address,
  walletClient?: WalletClient
) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected"
  >("disconnected");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentSession, setCurrentSession] = useState<AppSession | null>(null);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [usdBalance, setUsdBalance] = useState<number>(0);
  const [hasChannel, setHasChannel] = useState<boolean | null>(null);
  const [stateWalletClient, setStateWalletClient] =
    useState<WalletClient | null>(null);
  const [nitroliteClient, setNitroliteClient] =
    useState<NitroliteClient | null>(null);

  const walletRef = useRef<ethers.Wallet | null>(null);

  const messageSigner = useCallback(
    async (payload: any) => {
      if (!walletRef.current) throw new Error("Wallet not initialized");

      const message = JSON.stringify(payload);
      const digestHex = ethers.id(message);
      const messageBytes = ethers.getBytes(digestHex);
      const { serialized: signature } =
        walletRef.current.signingKey.sign(messageBytes);
      return signature as Hex;
    },
    [walletRef]
  );

  const browserSigner = useCallback(
    async (payload: any) => {
      console.log("walletClient", walletClient);
      console.log("walletClient.account", walletClient?.account);
      console.log("walletRef", walletRef.current);

      if (!walletClient || !walletClient.account)
        throw new Error("Wallet client not initialized");

      const challenge = validateChallenge(payload);

      const walletAddress = walletClient.account.address;

      const message = {
        challenge: challenge,
        scope: "console",
        wallet: walletAddress,
        application: walletAddress, // Your application address
        participant: walletRef.current?.address as Address, // The address of the signer
        expire: DEFAULT_EXPIRY.toString(), // 1 hour expiration
        allowances: [],
      };

      const AUTH_TYPES = {
        Policy: [
          { name: "challenge", type: "string" },
          { name: "scope", type: "string" },
          { name: "wallet", type: "address" },
          { name: "application", type: "address" },
          { name: "participant", type: "address" },
          { name: "expire", type: "uint256" },
          { name: "allowances", type: "Allowance[]" },
        ],
        Allowance: [
          { name: "asset", type: "string" },
          { name: "amount", type: "uint256" },
        ],
      };

      const signature = await walletClient.signTypedData({
        account: walletClient.account!,
        domain: {
          name: "yellow.fun",
        },
        types: AUTH_TYPES,
        primaryType: "Policy",
        message: message,
      });

      return signature;
    },
    [walletClient, walletRef]
  );

  const connectToWebSocket = useCallback(() => {
    console.log("Starting WebSocket connection");
    if (ws) {
      console.log("Closing existing WebSocket connection");
      ws.close();
    }

    setConnectionStatus("connecting");
    setError(null);

    console.log("Creating new WebSocket connection");
    const newWs = new WebSocket("wss://clearnet.yellow.com/ws");

    newWs.onopen = () => {
      console.log("WebSocket connection established");
      setConnectionStatus("connected");
      setWs(newWs);
    };

    newWs.onmessage = async (event) => {
      try {
        console.log("Received WebSocket message:", event.data);
        const message = JSON.parse(event.data);

        if (message.res && message.res[1] === "auth_challenge") {
          console.log("Handling auth challenge");
          const authVerify = await createAuthVerifyMessage(
            browserSigner,
            event.data,
            0
          );
          console.log("Sending auth verify message");
          newWs.send(authVerify);
        } else if (
          message.res &&
          (message.res[1] === "auth_success" || message.res[1] === "channels")
        ) {
          console.log("Authentication successful");
          setIsAuthenticated(true);
          if (message.res[2][0].length > 0) {
            setHasChannel(true);
            await addParticipantToDatabase(address as string);
            await loadParticipants();
          } else {
            setHasChannel(false);
          }
        } else if (message.res && message.res[1] === "bu") {
          console.log("State Ledger:", message.res[2]);
          if (message.res[2][0].length > 0) {
            setUsdBalance(
              message.res[2][0].filter((item: any) => item.asset === "usdc")[0]
                .amount
            );
          } else {
            setUsdBalance(0);
          }
        } else if (message.res && message.res[1] === "auth_failure") {
          console.error("Authentication failed:", message.res[2]);
          setError(`Authentication failed: ${message.res[2]}`);
        } else if (message.res && message.res[1] === "create_app_session") {
          console.log("Handling app session creation");
          const sessionId = message.res[2]?.[0]?.app_session_id;
          const status = message.res[2]?.[0]?.status || "open";
          if (sessionId) {
            console.log("Setting current session:", { sessionId, status });
            setCurrentSession({
              id: sessionId,
              status,
              participants: participants.map((p) => p.address),
              createdAt: Date.now(),
            });
          }
        } else if (message.res && message.res[1] === "close_app_session") {
          console.log("Handling app session closure");
          setCurrentSession(null);
        }
      } catch (err) {
        console.error("Error handling WebSocket message:", err);
      }
    };

    newWs.onerror = (error) => {
      console.error("WebSocket error occurred:", error);
      setError("WebSocket error");
      setConnectionStatus("disconnected");
    };

    newWs.onclose = () => {
      console.log("WebSocket connection closed");
      setConnectionStatus("disconnected");
      setIsAuthenticated(false);
    };
  }, [ws, messageSigner, address, participants, walletClient]);

  const authenticateUser = useCallback(async () => {
    console.log("Starting authentication process");

    if (!address) {
      console.log("No wallet connected");
      setError("No wallet connected");
      return;
    }

    try {
      console.log("Initializing provider and requesting accounts");
      console.log("Connected wallet address:", address);

      console.log("Creating signing wallet");
      const privateKey = ethers.randomBytes(32);
      const stateWalletAccount = privateKeyToAccount(
        ethers.hexlify(privateKey) as Hex
      );
      const _stateWalletClient = createWalletClient({
        account: stateWalletAccount,
        chain: flowMainnet,
        transport: http(),
      });
      setStateWalletClient(_stateWalletClient);
      const wallet = new ethers.Wallet(ethers.hexlify(privateKey));
      console.log("Generated wallet address:", wallet.address);
      walletRef.current = wallet;

      if (!ws) {
        console.error("WebSocket not connected");
        setError("WebSocket not connected");
        return;
      }

      console.log("Creating Nitrolite client with config:", {
        publicClient,
        walletClient: walletClient as any,
        stateWalletClient: _stateWalletClient as any,
        chainId: flowMainnet.id,
        addresses: {
          custody: "0x6258dCa1DF894980a8778197c60893a9fa2b5eF8",
          guestAddress: "0x0429A2Da7884CA14E53142988D5845952fE4DF6a",
          tokenAddress: "0x2aaBea2058b5aC2D339b163C6Ab6f2b6d53aabED",
          adjudicator: "0xEd44dba5ECB7928032649EF0075258FA3aca508B",
        },
        challengeDuration: BigInt("3600"),
      });

      setNitroliteClient(
        new NitroliteClient({
          publicClient,
          walletClient: walletClient as any,
          stateWalletClient: _stateWalletClient as any,
          chainId: flowMainnet.id,
          addresses: {
            custody: "0x6258dCa1DF894980a8778197c60893a9fa2b5eF8",
            guestAddress: "0x0429A2Da7884CA14E53142988D5845952fE4DF6a",
            tokenAddress: "0x2aaBea2058b5aC2D339b163C6Ab6f2b6d53aabED",
            adjudicator: "0xEd44dba5ECB7928032649EF0075258FA3aca508B",
          },
          challengeDuration: BigInt("3600"),
        })
      );

      console.log("Creating auth request message");
      const authRequest = await createAuthRequestMessage({
        wallet: address as Address,
        participant: wallet.address as Address,
        app_name: "yellow.fun",
        expire: DEFAULT_EXPIRY.toString(),
        scope: "console",
        application: address as Address,
        allowances: [],
      });
      console.log("Auth request created:", authRequest);

      console.log("Sending auth request");
      ws.send(authRequest);
      console.log("Auth request sent successfully");
    } catch (err) {
      console.error("Authentication error:", err);
      setError(`Authentication error: ${err}`);
    }
  }, [ws]);

  const createChannel = useCallback(
    async (
      amount: string
    ): Promise<{
      depositTxHash: string;
      createChannelTxHash: string;
    }> => {
      if (!nitroliteClient) {
        console.log("Nitrolite client is not initialized");
        return {
          depositTxHash: "",
          createChannelTxHash: "",
        };
      }

      const { txHash } = await nitroliteClient.createChannel({
        initialAllocationAmounts: [BigInt(amount), BigInt(0)],
        stateData: "0x",
      });

      console.log("Channel created");
      console.log("Deposit tx hash:", txHash);
      console.log("Create channel tx hash:", txHash);
      return {
        depositTxHash: txHash,
        createChannelTxHash: txHash,
      };
    },

    [nitroliteClient]
  );

  const addParticipantToDatabase = async (address: string) => {
    try {
      const { error } = await supabase.from("participants").upsert({
        address,
        joined_at: new Date().toISOString(),
      });

      if (error) throw error;
    } catch (err) {
      console.error("Error adding participant:", err);
    }
  };

  const loadParticipants = async () => {
    try {
      const { data, error } = await supabase
        .from("participants")
        .select("*")
        .order("joined_at", { ascending: true });

      if (error) throw error;

      setParticipants(
        data?.map((p) => ({
          address: p.address,
          joinedAt: new Date(p.joined_at).getTime(),
        })) || []
      );
    } catch (err) {
      console.error("Error loading participants:", err);
    }
  };

  const createAppSession = useCallback(
    async (allocationChanges: Allocation[]) => {
      if (!ws || !walletRef.current || participants.length < 2) {
        setError("Need at least 2 participants to create session");
        return;
      }

      try {
        const appDefinition = {
          protocol: "nitroliterpc",
          participants: participants.map((p) => p.address as Address),
          weights: [100, ...Array(participants.length - 1).fill(0)],
          quorum: 100,
          challenge: 0,
          nonce: Date.now(),
        };

        const allocations = participants.map((p) => ({
          participant: p.address as Address,
          asset: "usdc",
          amount: "0",
        }));

        for (const change of allocationChanges) {
          const existing = allocations.find(
            (a) =>
              a.participant === change.participant && a.asset === change.asset
          );
          if (existing) {
            existing.amount = change.amount;
          } else {
            allocations.push(change);
          }
        }

        console.log("Allocations:", allocations);

        const signedMessage = await createAppSessionMessage(messageSigner, [
          {
            definition: appDefinition,
            allocations,
          },
        ]);

        ws.send(signedMessage);
      } catch (err) {
        setError(`Error creating session: ${err}`);
      }
    },
    [ws, participants, messageSigner]
  );

  const closeAppSession = useCallback(
    async (allocationChanges: Allocation[]) => {
      if (!ws || !currentSession || !walletRef.current) {
        setError("No active session to close");
        return;
      }

      try {
        const allocations = participants.map((p) => ({
          participant: p.address as Address,
          asset: "usdc",
          amount: "0",
        }));

        for (const change of allocationChanges) {
          const existing = allocations.find(
            (a) =>
              a.participant === change.participant && a.asset === change.asset
          );
          if (existing) {
            existing.amount = change.amount;
          } else {
            allocations.push(change);
          }
        }

        console.log("Allocations:", allocations);

        const closeRequest = {
          app_session_id: currentSession.id as Hex,
          allocations,
        };

        const signedMessage = await createCloseAppSessionMessage(
          messageSigner,
          [closeRequest]
        );

        ws.send(signedMessage);
      } catch (err) {
        setError(`Error closing session: ${err}`);
      }
    },
    [ws, currentSession, allocations, messageSigner]
  );

  const updateAllocation = useCallback(
    (participant: string, asset: string, amount: string) => {
      setAllocations((prev) => {
        const existing = prev.find(
          (a) => a.participant === participant && a.asset === asset
        );
        if (existing) {
          return prev.map((a) =>
            a.participant === participant && a.asset === asset
              ? { ...a, amount }
              : a
          );
        } else {
          return [
            ...prev,
            { participant: participant as Address, asset, amount },
          ];
        }
      });
    },
    []
  );

  const removeAllocation = useCallback((participant: string, asset: string) => {
    setAllocations((prev) =>
      prev.filter((a) => !(a.participant === participant && a.asset === asset))
    );
  }, []);

  return {
    ws,
    connectionStatus,
    isAuthenticated,
    participants,
    currentSession,
    allocations,
    error,
    hasChannel,
    usdBalance,
    setUsdBalance,
    setHasChannel,
    setIsAuthenticated,
    connectToWebSocket,
    createChannel,
    authenticateUser,
    createAppSession,
    closeAppSession,
    updateAllocation,
    removeAllocation,
  };
};
