"use client";

import Link from "next/link";
import Image from "next/image";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 border-[0px]">
      <div className="px-4 py-3">
        <div className="flex items-center justify-start">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="yellow.fun" width={32} height={32} />
            <span className="text-md font-black text-black">yellow.fun</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
