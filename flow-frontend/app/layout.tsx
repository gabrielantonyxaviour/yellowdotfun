import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import Layout from "@/components/layout";
import { WorldProvider } from "@/components/providers/world-provider";
import "@worldcoin/mini-apps-ui-kit-react/styles.css";
import { ErudaProvider } from "@/components/eruda";

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
        <ErudaProvider>
          <WorldProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <Layout>{children}</Layout>
              <Toaster />
            </ThemeProvider>
          </WorldProvider>
        </ErudaProvider>
      </body>
    </html>
  );
}
