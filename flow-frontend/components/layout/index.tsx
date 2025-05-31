"use client";

import { useCallback, useEffect, useState } from "react";
import { AppHeader } from "./app-header";
import { Footer } from "./footer";
import { MiniKit, User } from "@worldcoin/minikit-js";
import { SplashScreen } from "../splash";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkMiniKit = async () => {
      try {
        const isInstalled = MiniKit.isInstalled();
        if (isInstalled) {
          setIsLoading(false);
        } else {
          setTimeout(checkMiniKit, 500);
        }
      } catch (e) {
        setTimeout(checkMiniKit, 500);
      }
    };

    checkMiniKit();
  }, []);

  const refreshUserData = useCallback(async () => {
    try {
      setFetchingProfile(true);
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setFetchingProfile(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      refreshUserData();
    }
  }, [isLoading, refreshUserData]);

  return isLoading || fetchingProfile ? (
    <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <div className="w-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 p-4 text-center">
          <Image
            src="/logo.png"
            alt="logo"
            width={150}
            height={150}
            className="mx-auto"
          />
          <p className="text-black font-black text-xl pb-16">yellow.fun</p>

          <p className="text-black text-md font-medium">
            Welcome trader. <br /> This is a{" "}
            <span className="font-semibold text-">World Mini App</span> and only
            works on the World Mobile App. <br />
          </p>
        </div>
        <div className="flex text-stone-400 space-x-2 py-6 items-center justify-center">
          <Loader2 className="animate-spin" />
          {fetchingProfile ? <p>Loading</p> : <p>Setting up the app</p>}
        </div>
      </div>
    </div>
  ) : user ? (
    <div className="min-h-screen bg-black">
      <AppHeader user={user} setUser={setUser} />
      {children}
      {!MiniKit.isInstalled() && <Footer />}
    </div>
  ) : (
    <SplashScreen user={user} setUser={setUser} />
  );
}
