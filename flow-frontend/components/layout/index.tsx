"use client";

import { AppHeader } from "./app-header";
import { SplashScreen } from "../splash";
import { useAccount, useConnect } from "wagmi";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { connectAsync } = useConnect();
  const { address } = useAccount();
  return address ? (
    <div className="min-h-screen bg-black">
      <AppHeader />
      {children}
    </div>
  ) : (
    <SplashScreen />
  );
}
