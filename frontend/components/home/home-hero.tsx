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
          <h1 className="text-2xl font-black text-black">Coins</h1>
          <Button
            className="yellow-button rounded-full p-3"
            onClick={() => setIsCreateSheetOpen(true)}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          <Input
            placeholder="Search coins..."
            className="yellow-border pl-10 py-3 text-base rounded-xl bg-white"
          />
        </div>
      </div>

      <CreateCoinSheet
        open={isCreateSheetOpen}
        onOpenChange={setIsCreateSheetOpen}
      />
    </>
  );
}
