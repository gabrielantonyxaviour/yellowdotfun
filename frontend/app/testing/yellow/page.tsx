"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNitroliteClient } from "@/hooks/use-nitrolite-client";
import { useClearNodeConnection } from "@/hooks/use-clear-node-connection";
import { useChannelOperations } from "@/hooks/use-channel-operations";
import { ethers } from "ethers";

export default function ERC7824TestPage() {
  const {
    client,
    loading: clientLoading,
    error: clientError,
    walletAddress,
    initializeClient,
  } = useNitroliteClient();
  const {
    connectionStatus,
    error: wsError,
    channels,
    balances,
    connect,
    getChannels,
    getLedgerBalances,
    disconnect,
  } = useClearNodeConnection();
  const {
    loading: channelLoading,
    error: channelError,
    channelData,
    accountInfo,
    depositAndCreateChannel,
    getAccountInfo,
    getTokenBalance,
    deposit,
    withdrawal,
  } = useChannelOperations(client);

  const [depositAmount, setDepositAmount] = useState("1");
  const [withdrawalAmount, setWithdrawalAmount] = useState("0.5");
  const [tokenBalance, setTokenBalance] = useState<bigint | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    if (client) {
      getAccountInfo();
      refreshTokenBalance();
    }
  }, [client, getAccountInfo]);

  const refreshTokenBalance = async () => {
    if (!client) return;
    const balance = await getTokenBalance();
    setTokenBalance(balance);
  };

  const addTestResult = (result: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${result}`,
    ]);
  };

  const handleInitializeClient = async () => {
    try {
      await initializeClient();
      addTestResult("✅ Client initialized successfully");
    } catch (err) {
      addTestResult(`❌ Client initialization failed: ${err}`);
    }
  };

  const handleConnectClearNode = async () => {
    if (!client) return;

    try {
      const stateWalletKey = localStorage.getItem("nitrolite_state_wallet_key");
      if (!stateWalletKey) throw new Error("State wallet not found");

      const stateWallet = new ethers.Wallet(stateWalletKey);
      await connect(process.env.NEXT_PUBLIC_CLEARNODE_URL!, stateWallet);
      addTestResult("✅ Connected to ClearNode");
    } catch (err) {
      addTestResult(`❌ ClearNode connection failed: ${err}`);
    }
  };

  const handleDeposit = async () => {
    try {
      const amount = ethers.parseUnits(depositAmount, 6); // Assuming USDC with 6 decimals
      await deposit(amount);
      addTestResult(`✅ Deposited ${depositAmount} tokens`);
      await refreshTokenBalance();
    } catch (err) {
      addTestResult(`❌ Deposit failed: ${err}`);
    }
  };

  const handleCreateChannel = async () => {
    try {
      const amount = ethers.parseUnits(depositAmount, 6);
      const result = await depositAndCreateChannel(amount);
      addTestResult(`✅ Channel created: ${result.channelId}`);
    } catch (err) {
      addTestResult(`❌ Channel creation failed: ${err}`);
    }
  };

  const handleGetChannels = async () => {
    try {
      await getChannels();
      addTestResult(`✅ Retrieved ${channels.length} channels`);
    } catch (err) {
      addTestResult(`❌ Failed to get channels: ${err}`);
    }
  };

  const handleGetBalances = async () => {
    if (!walletAddress) return;

    try {
      await getLedgerBalances(walletAddress);
      addTestResult("✅ Retrieved ledger balances");
    } catch (err) {
      addTestResult(`❌ Failed to get balances: ${err}`);
    }
  };

  const handleWithdrawal = async () => {
    try {
      const amount = ethers.parseUnits(withdrawalAmount, 6);
      await withdrawal(amount);
      addTestResult(`✅ Withdrew ${withdrawalAmount} tokens`);
      await refreshTokenBalance();
    } catch (err) {
      addTestResult(`❌ Withdrawal failed: ${err}`);
    }
  };

  const formatBalance = (balance: bigint | null) => {
    return balance ? ethers.formatUnits(balance, 6) : "0";
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">ERC 7824 Nitrolite Testing</h1>
        <p className="text-muted-foreground">
          Complete state channel workflow testing
        </p>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Badge variant={client ? "default" : "secondary"}>
                Client: {client ? "Ready" : "Not Ready"}
              </Badge>
            </div>
            <div className="text-center">
              <Badge
                variant={
                  connectionStatus === "authenticated" ? "default" : "secondary"
                }
              >
                ClearNode: {connectionStatus}
              </Badge>
            </div>
            <div className="text-center">
              <Badge variant={channelData ? "default" : "secondary"}>
                Channel: {channelData ? "Created" : "None"}
              </Badge>
            </div>
            <div className="text-center">
              <Badge variant={walletAddress ? "default" : "secondary"}>
                Wallet: {walletAddress ? "Connected" : "Not Connected"}
              </Badge>
            </div>
          </div>

          {walletAddress && (
            <div className="text-sm text-muted-foreground">
              <p>Wallet: {walletAddress}</p>
              <p>Token Balance: {formatBalance(tokenBalance)} USDC</p>
              {accountInfo && (
                <>
                  <p>Available: {formatBalance(accountInfo.available)} USDC</p>
                  <p>
                    Locked: {formatBalance(accountInfo.locked || BigInt(0))}{" "}
                    USDC
                  </p>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Setup & Connection */}
        <Card>
          <CardHeader>
            <CardTitle>1. Setup & Connection</CardTitle>
            <CardDescription>
              Initialize client and connect to services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleInitializeClient}
              disabled={clientLoading}
              className="w-full"
            >
              {clientLoading ? "Initializing..." : "Initialize Client"}
            </Button>

            <Button
              onClick={handleConnectClearNode}
              disabled={!client || connectionStatus === "authenticated"}
              className="w-full"
            >
              Connect to ClearNode
            </Button>

            {(clientError || wsError) && (
              <div className="text-sm text-red-500">
                {clientError || wsError}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Channel Operations */}
        <Card>
          <CardHeader>
            <CardTitle>2. Channel Operations</CardTitle>
            <CardDescription>
              Manage deposits, channels, and withdrawals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.1"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Amount"
              />
              <Button
                onClick={handleDeposit}
                disabled={!client || channelLoading}
              >
                Deposit
              </Button>
            </div>

            <Button
              onClick={handleCreateChannel}
              disabled={!client || channelLoading}
              className="w-full"
            >
              {channelLoading ? "Creating..." : "Create Channel"}
            </Button>

            <div className="flex gap-2">
              <Input
                type="number"
                step="0.1"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                placeholder="Amount"
              />
              <Button
                onClick={handleWithdrawal}
                disabled={!client || channelLoading}
              >
                Withdraw
              </Button>
            </div>

            {channelError && (
              <div className="text-sm text-red-500">{channelError}</div>
            )}
          </CardContent>
        </Card>

        {/* Data Retrieval */}
        <Card>
          <CardHeader>
            <CardTitle>3. Data Retrieval</CardTitle>
            <CardDescription>Query channels and balances</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleGetChannels}
              disabled={connectionStatus !== "authenticated"}
              className="w-full"
            >
              Get Channels
            </Button>

            <Button
              onClick={handleGetBalances}
              disabled={connectionStatus !== "authenticated"}
              className="w-full"
            >
              Get Ledger Balances
            </Button>

            <Button
              onClick={() => getAccountInfo()}
              disabled={!client}
              className="w-full"
            >
              Refresh Account Info
            </Button>
          </CardContent>
        </Card>

        {/* Results & Data */}
        <Card>
          <CardHeader>
            <CardTitle>4. Results & Data</CardTitle>
            <CardDescription>
              View channels, balances, and test results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {channels.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">
                  Channels ({channels.length})
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {channels.map((channel, i) => (
                    <div key={i} className="text-xs bg-muted p-2 rounded">
                      <p>ID: {channel.channel_id?.slice(0, 10)}...</p>
                      <p>Status: {channel.status}</p>
                      <p>Amount: {channel.amount}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {balances && (
              <div>
                <h4 className="font-semibold mb-2">Ledger Balances</h4>
                <div className="text-xs bg-muted p-2 rounded">
                  <pre>{JSON.stringify(balances, null, 2)}</pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Test Results Log */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results Log</CardTitle>
          <CardDescription>Real-time test execution results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {testResults.map((result, i) => (
              <div key={i} className="text-sm font-mono bg-muted p-2 rounded">
                {result}
              </div>
            ))}
            {testResults.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No test results yet. Start by initializing the client.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
