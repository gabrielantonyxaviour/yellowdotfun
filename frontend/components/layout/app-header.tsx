// components/AppHeader.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Wallet, User, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePrivy } from "@privy-io/react-auth";
import { BalanceDropdown } from "./balance-dropdown";
import { useMultiChainBalance } from "@/hooks/use-multichain-balance";
import Image from "next/image";

export function AppHeader() {
  const { authenticated, user, logout, login } = usePrivy();
  const { balances, totalUsd } = useMultiChainBalance();

  return (
    <header className="sticky top-0 z-50 bg-yellow-400 border-b-2 border-black safe-area-top">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/home" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="yellow.fun" width={32} height={32} />
            <span className="text-xl font-black text-black">yellow.fun</span>
          </Link>

          {authenticated ? (
            <div className="flex items-center gap-2">
              <BalanceDropdown balances={balances} totalUsd={totalUsd} />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="yellow-button p-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="yellow-border w-48">
                  <DropdownMenuLabel>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">
                        {user?.wallet?.address?.slice(0, 6)}...
                        {user?.wallet?.address?.slice(-4)}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link
                      href="/portfolio"
                      className="flex items-center w-full"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Portfolio</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Disconnect</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button onClick={login} className="yellow-button text-sm px-3 py-2">
              <Wallet className="mr-1 h-4 w-4" />
              Connect
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
