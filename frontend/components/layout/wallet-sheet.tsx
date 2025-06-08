import { SheetHeader, SheetTitle } from "../ui/sheet";
import { SheetContent } from "../ui/sheet";
import { SheetTrigger } from "../ui/sheet";
import { Sheet } from "../ui/sheet";
import Image from "next/image";
import { useState } from "react";
import { WalletSwapUI } from "./wallet-swap-ui";

export default function WalletSheet({
  usdBalance,
  connectionStatus,
  connectToWebSocket,
}: {
  usdBalance: number;
  connectionStatus: string;
  connectToWebSocket: () => void;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex items-center space-x-1 border border-stone-600 rounded-lg px-2 py-1 hover:bg-yellow-400 active:bg-yellow-600">
          <Image src="/usd.png" alt="USD" width={16} height={16} />
          <span className="text-sm font-bold text-black">
            {usdBalance.toLocaleString()}
          </span>
          <span className="text-lg text-black font-bold">+</span>
        </button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="bg-black border-t border-stone-600 rounded-t-xl"
      >
        <SheetHeader>
          <SheetTitle className="text-white text-start">
            Wallet Balance
          </SheetTitle>
        </SheetHeader>
        <WalletSwapUI
          balance={usdBalance}
          connectionStatus={connectionStatus}
          connectToWebSocket={connectToWebSocket}
        />
      </SheetContent>
    </Sheet>
  );
}
