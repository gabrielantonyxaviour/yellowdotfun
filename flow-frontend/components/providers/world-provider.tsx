"use client";

import { isMainnet } from "@/lib/constants";
import type React from "react";
import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider";

export function WorldProvider({ children }: { children: React.ReactNode }) {
  return <MiniKitProvider>{children}</MiniKitProvider>;
}
