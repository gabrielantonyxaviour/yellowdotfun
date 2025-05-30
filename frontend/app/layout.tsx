import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { PrivyProviderWrapper } from "@/components/providers/privy-provider";
import Layout from "@/components/layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "yellow.fun - EVM Memecoin Trading Platform",
  description: "Trade memecoins on any EVM chain powered by Yellow Protocol",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <PrivyProviderWrapper>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <Layout>{children}</Layout>
            <Toaster />
          </ThemeProvider>
        </PrivyProviderWrapper>
      </body>
    </html>
  );
}
