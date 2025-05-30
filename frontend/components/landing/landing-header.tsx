"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useWallet } from "@/contexts/wallet-context";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isConnected } = useWallet();
  const router = useRouter();

  // Redirect if already connected
  useEffect(() => {
    if (isConnected) {
      router.push("/home");
    }
  }, [isConnected, router]);

  return (
    <header className="sticky top-0 z-50 bg-yellow-400 yellow-border border-t-0 border-l-0 border-r-0">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="yellow.fun" width={42} height={42} />
            <span className="text-2xl font-black yellow-text">yellow.fun</span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/home">
              <Button className="yellow-button bg-black text-yellow-400">
                Connect Wallet
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
