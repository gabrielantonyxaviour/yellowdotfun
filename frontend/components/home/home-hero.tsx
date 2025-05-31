// components/home/HomeHero.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useState } from "react";
import { CreateCoinSheet } from "@/components/create/create-coin-sheet";

export function HomeHero() {
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);

  return (
    <>
      <div className="py-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-white">Coins</h1>

          <CreateCoinSheet
            open={isCreateSheetOpen}
            onOpenChange={setIsCreateSheetOpen}
          />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-5 w-5" />
          <Input
            placeholder="Search coins..."
            className="yellow-border pl-10 py-3 text-base rounded-xl bg-stone-800 text-white placeholder:text-stone-400"
          />
        </div>
      </div>
    </>
  );
}
