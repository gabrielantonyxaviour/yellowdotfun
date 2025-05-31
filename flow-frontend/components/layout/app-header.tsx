"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { User } from "@worldcoin/minikit-js";

export function AppHeader({
  user,
  setUser,
}: {
  user: User | null;
  setUser: (user: User | null) => void;
}) {
  const [balance, setBalance] = useState(1230);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 border-b-2 border-black safe-area-top">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/home" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="yellow.fun" width={32} height={32} />
            <span className="text-md font-black text-black">yellow.fun</span>
          </Link>

          <div className="flex items-center space-x-4">
            {/* USD Balance */}
            <button className="flex items-center space-x-1 border border-black rounded-lg px-2 py-1 hover:bg-black/5 active:bg-black/10">
              <Image src="/usd.png" alt="USD" width={16} height={16} />
              <span className="text-sm font-bold text-black">
                {balance.toLocaleString()}
              </span>
              <span className="text-lg text-black font-bold">+</span>
            </button>

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
