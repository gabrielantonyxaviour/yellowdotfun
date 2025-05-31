// components/splash/SplashScreen.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { worldchain } from "viem/chains";

export function SplashScreen() {
  const [loading, setLoading] = useState(false);
  const { connectAsync } = useConnect();

  const handleLogin = async () => {
    try {
      setLoading(true);
      await connectAsync({ connector: injected() });
      setLoading(false);
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 flex flex-col items-center justify-between p-6">
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
        <div className="space-y-4">
          <Image src="/logo.png" alt="Yellow.fun" width={120} height={120} />
          <h1 className="text-4xl font-black text-black">yellow.fun</h1>
        </div>
        <p className="text-lg font-bold text-black/80 max-w-sm leading-relaxed">
          Faster, cheaper, and EVM-secured alternative for pump.fun, built using
          ERC7824
        </p>
      </div>

      <Button
        onClick={handleLogin}
        disabled={loading}
        className="w-full flex space-x-2 max-w-sm bg-black text-yellow-400 hover:bg-black/90 py-6 rounded-2xl font-bold text-lg border-2 border-black shadow-lg"
      >
        <Image src="/flow.png" alt="Flow" width={20} height={20} />
        <p className="text-sm font-semibold">Sign in with Flow</p>
      </Button>
    </div>
  );
}
