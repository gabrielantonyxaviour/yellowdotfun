import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import Layout from "@/components/layout";
import { ErudaProvider } from "@/components/eruda";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "yellow.fun - Next Gen Memecoin Trading App",
  description:
    "Faster, cheaper, and EVM-secured alternative for pump.fun, built using ERC7824",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Layout>{children}</Layout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
