"use client";

import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-yellow-400 yellow-border border-t-0 border-l-0 border-r-0">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-black yellow-text">yellow.fun</span>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          <nav
            className={`${
              isMenuOpen
                ? "block absolute top-16 left-0 right-0 bg-yellow-400 yellow-border border-t-0 border-l-0 border-r-0 p-4"
                : "hidden"
            } md:flex md:items-center md:space-x-6 md:static`}
          >
            <Link
              href="/tokens"
              className="block py-2 md:py-0 font-bold hover:text-yellow-800 transition-colors"
            >
              Tokens
            </Link>
            <Link
              href="/create"
              className="block py-2 md:py-0 font-bold hover:text-yellow-800 transition-colors"
            >
              Create Token
            </Link>
            <Link
              href="/portfolio"
              className="block py-2 md:py-0 font-bold hover:text-yellow-800 transition-colors"
            >
              Portfolio
            </Link>
          </nav>

          <div className="hidden md:block">
            <Button className="yellow-button">
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
