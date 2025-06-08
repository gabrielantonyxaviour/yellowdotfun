"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { useAccount, useDisconnect } from "wagmi";
import { useState } from "react";
import WalletSheet from "./wallet-sheet";

export function AppHeader({
  usdBalance,
  connectionStatus,
  connectToWebSocket,
}: {
  usdBalance: number;
  connectionStatus: string;
  connectToWebSocket: () => void;
}) {
  const { address } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const handleLogout = async () => {
    try {
      await disconnectAsync();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 border-b-2 border-black safe-area-top">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="yellow.fun" width={32} height={32} />
            <span className="text-md font-black text-black">yellow.fun</span>
          </Link>

          <div className="flex items-center space-x-4">
            <WalletSheet
              usdBalance={usdBalance}
              connectionStatus={connectionStatus}
              connectToWebSocket={connectToWebSocket}
            />

            {/* Logout Button */}
            <button
              className="p-1 hover:bg-black/10 rounded"
              onClick={handleLogout}
            >
              <LogOut className="w-6 h-6 text-black" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
