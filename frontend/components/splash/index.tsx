// components/splash/SplashScreen.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAccount, useWalletClient } from "wagmi";
import { Badge } from "../ui/badge";
import { Loader2, LogOut } from "lucide-react";
import { useConnectWallet, usePrivy } from "@privy-io/react-auth";
import { useTokenBalance } from "@/hooks/use-token-balance";
import { formatUnits, parseUnits, WalletClient } from "viem";

export function SplashScreen({
  isAuthenticated,
  logout,
  hasChannel,
  walletClient,
  authenticateUser,
  createChannel,
  connectionStatus,
  connectToWebSocket,
}: {
  isAuthenticated: boolean;
  hasChannel: boolean | null;
  logout: () => void;
  walletClient: WalletClient | undefined;
  authenticateUser: () => void;
  createChannel: (amount: string) => Promise<{
    depositTxHash: string;
    createChannelTxHash: string;
  }>;
  connectionStatus: string;
  connectToWebSocket: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState<string>("0");
  const { authenticated, login } = usePrivy();
  const { address } = useAccount();
  const { balance: usdBalance } = useTokenBalance(address);

  useEffect(() => {
    if (authenticated) {
      connectToWebSocket();
      setLoading(false);
    }
  }, [authenticated]);

  useEffect(() => {
    console.log("Wallet Client");
    console.log(walletClient);
  }, [walletClient]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      login();
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
    }
  };

  const handleAuthenticateChannel = async () => {
    if (!address) {
      console.log("No address");
      return;
    }
    try {
      setLoading(true);
      authenticateUser();
      setLoading(false);
    } catch (error) {
      console.error("Authenticate channel error:", error);
    }
  };

  const handleCreateChannel = async () => {
    if (isNaN(parseFloat(depositAmount)) || parseFloat(depositAmount) <= 0) {
      console.log("Deposit amount is 0 or invalid");
      return;
    }
    setLoading(true);
    const { depositTxHash, createChannelTxHash } = await createChannel("100");
    console.log("Deposit tx hash:", depositTxHash);
    console.log("Create channel tx hash:", createChannelTxHash);
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 flex flex-col items-center justify-between p-6">
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
        <div className="space-y-4">
          <Image
            src="/logo.png"
            alt="Yellow.fun"
            width={120}
            height={120}
            className="mx-auto"
          />
          <h1 className="text-4xl font-black text-black">yellow.fun</h1>
        </div>
        <p className="text-lg font-bold text-black/80 max-w-sm leading-relaxed">
          Faster, cheaper, and EVM-secured alternative for pump.fun, built using
          ERC7824
        </p>
      </div>

      {authenticated && (
        <Badge
          className={`${
            connectionStatus === "connected"
              ? "bg-green-500 hover:bg-green-600 cursor-default"
              : connectionStatus === "connecting"
              ? "bg-yellow-500 hover:bg-yellow-600 cursor-default"
              : "bg-red-500 hover:bg-red-600 cursor-pointer"
          }  cursor-pointer mb-3`}
          onClick={() => {
            if (connectionStatus === "disconnected") {
              connectToWebSocket();
            }
          }}
        >
          {connectionStatus}
        </Badge>
      )}
      {!authenticated ? (
        <Button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex space-x-2 max-w-sm bg-black text-yellow-400 hover:bg-black/90 py-6 rounded-2xl font-bold text-lg border-2 border-black shadow-lg"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <p className="text-sm font-semibold">Connect Wallet</p>
          )}
        </Button>
      ) : !isAuthenticated ? (
        <div className="flex items-center justify-center w-full space-x-6">
          <Button
            onClick={handleAuthenticateChannel}
            disabled={loading}
            className="w-full flex flex-1 space-x-2 max-w-sm bg-black text-yellow-400 hover:bg-black/90 py-6 rounded-2xl font-bold text-lg border-2 border-black shadow-lg"
          >
            <Image
              src="/yellow.jpg"
              alt="Yellow"
              width={20}
              height={20}
              className="rounded-full"
            />
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                <p className="text-sm font-semibold">Authenticating</p>
              </>
            ) : !walletClient ? (
              <>
                <Loader2 className="animate-spin" />
                <p className="text-sm font-semibold">
                  Initializing Wallet Client
                </p>
              </>
            ) : (
              <p className="text-sm font-semibold">Authenticate your Channel</p>
            )}
          </Button>
          <button
            className="p-1 hover:bg-black/10 rounded hover:bg-transparent"
            onClick={() => {
              logout();
            }}
          >
            <LogOut className="w-6 h-6 text-black" />
          </button>
        </div>
      ) : (
        !hasChannel && (
          <div className="flex flex-col items-center justify-center w-full space-y-4 px-4">
            <div className="w-full max-w-sm bg-white/5 rounded-xl p-4 border border-black/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/usdc.png"
                    alt="USDF"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="text-sm font-medium">USDF Balance</span>
                </div>
                <span className="text-sm font-semibold">
                  {formatUnits(usdBalance, 6)} USDF
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Enter amount"
                  className="flex-1 bg-white/5 border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                  value={depositAmount}
                  onChange={(e) => {
                    setDepositAmount(e.target.value);
                  }}
                />
                <span className="text-sm font-medium">USDF</span>
              </div>
            </div>

            <div className="flex items-center justify-center w-full space-x-4">
              <Button
                onClick={handleCreateChannel}
                disabled={loading || !depositAmount}
                className="w-full flex flex-1 space-x-2 max-w-sm bg-black text-yellow-400 hover:bg-black/90 py-4 rounded-xl font-bold text-sm border-2 border-black shadow-lg"
              >
                <Image
                  src="/yellow.jpg"
                  alt="Yellow"
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <p className="text-sm font-semibold">Create Channel</p>
                )}
              </Button>
              <button
                className="p-1 hover:bg-black/10 rounded hover:bg-transparent"
                onClick={() => {
                  logout();
                }}
              >
                <LogOut className="w-6 h-6 text-black" />
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
