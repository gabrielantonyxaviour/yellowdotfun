"use client";

import { Button } from "@/components/ui/button";
import { Wallet, User, LogOut, ChevronDown } from "lucide-react";
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
import { ChainBalanceDropdown } from "./chain-balance-dropdown";
import { useMultiChainBalance } from "@/hooks/use-multichain-balance";

export function AppHeader() {
  const { authenticated, user, login, logout } = usePrivy();
  const { balances, totalUsd } = useMultiChainBalance();
  return (
    <header className="sticky top-0 z-50 bg-yellow-400 yellow-border border-t-0 border-l-0 border-r-0">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/home" className="flex items-center space-x-2">
            <span className="text-2xl font-black yellow-text">yellow.fun</span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            {authenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="yellow-button">
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="mr-2">
                        {user?.wallet?.address?.slice(0, 6)}...
                        {user?.wallet?.address?.slice(-4)}
                      </span>
                      <ChainBalanceDropdown
                        balances={balances}
                        totalUsd={totalUsd}
                      />
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="yellow-border">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
            ) : (
              <Button onClick={login} className="yellow-button">
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
