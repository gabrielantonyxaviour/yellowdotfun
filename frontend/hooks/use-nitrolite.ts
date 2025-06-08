// app/testing/yellow/hooks/useNitrolite.ts
import { useState, useCallback, useRef } from "react";
import { ethers } from "ethers";
import {
  createAuthRequestMessage,
  createAuthVerifyMessage,
  createAppSessionMessage,
  createCloseAppSessionMessage,
  createGetChannelsMessage,
} from "@erc7824/nitrolite";
import { supabase } from "@/lib/supabase";
import { Account, Address, createWalletClient, custom, Hex } from "viem";
import { worldchain } from "viem/chains";
import { DEFAULT_EXPIRY } from "@/lib/constants";
import { flowMainnet } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { useAccount } from "wagmi";
import { validateChallenge } from "@/lib/utils";

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

export const useNitrolite = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected"
  >("disconnected");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentSession, setCurrentSession] = useState<AppSession | null>(null);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [usdBalance, setUsdBalance] = useState<number>(0);
  const [hasChannel, setHasChannel] = useState<boolean | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  const walletRef = useRef<ethers.Wallet | null>(null);

  const messageSigner = useCallback(async (payload: any) => {
    if (!walletRef.current) throw new Error("Wallet not initialized");

    const message = JSON.stringify(payload);
    const digestHex = ethers.id(message);
    const messageBytes = ethers.getBytes(digestHex);
    const { serialized: signature } =
      walletRef.current.signingKey.sign(messageBytes);
    return signature as Hex;
  }, []);

  const browserSigner = useCallback(async (payload: any) => {
    const challenge = validateChallenge(payload);

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    const walletClient = createWalletClient({
      chain: flowMainnet,
      transport: custom(window.ethereum),
      account: address as Address,
    });

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
  }, []);

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
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            setHasChannel(true);
            await addParticipantToDatabase(address);
            await loadParticipants();
          } else {
            setHasChannel(false);
          }
        } else if (message.res && message.res[1] === "bu") {
          console.log("State Ledger:", message.res[2]);
          setUsdBalance(
            message.res[2][0].filter((item: any) => item.asset === "usdc")[0]
              .amount
          );
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
  }, [ws, messageSigner, userAddress, participants]);

  const authenticateUser = useCallback(async () => {
    console.log("Starting authentication process");

    if (!window.ethereum) {
      console.error("No Ethereum provider found");
      setError("No Ethereum provider found");
      return;
    }

    try {
      console.log("Initializing provider and requesting accounts");
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAddress(address);
      console.log("Connected wallet address:", address);

      console.log("Creating signing wallet");
      const privateKey = ethers.randomBytes(32);
      const wallet = new ethers.Wallet(ethers.hexlify(privateKey));
      console.log("Generated wallet address:", wallet.address);
      walletRef.current = wallet;
      setUserAddress(address);

      if (!ws) {
        console.error("WebSocket not connected");
        setError("WebSocket not connected");
        return;
      }

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
    connectToWebSocket,
    authenticateUser,
    createAppSession,
    closeAppSession,
    updateAllocation,
    removeAllocation,
  };
};
