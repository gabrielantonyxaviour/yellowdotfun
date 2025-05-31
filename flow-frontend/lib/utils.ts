import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatNumber(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`
  return num.toFixed(2)
}

export function formatPercentage(num: number): string {
  return `${num >= 0 ? "+" : ""}${num.toFixed(2)}%`
}
