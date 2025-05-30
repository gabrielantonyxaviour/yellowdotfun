"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type WalletContextType = {
  isConnected: boolean
  address: string | null
  balance: string
  chain: string
  connect: () => void
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  address: null,
  balance: "0",
  chain: "Ethereum",
  connect: () => {},
  disconnect: () => {},
})

export const useWallet = () => useContext(WalletContext)

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState("0")
  const [chain, setChain] = useState("Ethereum")
  const router = useRouter()

  // Check if wallet is already connected on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem("wallet")
    if (savedWallet) {
      const walletData = JSON.parse(savedWallet)
      setIsConnected(true)
      setAddress(walletData.address)
      setBalance(walletData.balance)
      setChain(walletData.chain)
    }
  }, [])

  const connect = () => {
    // Mock wallet connection
    const mockAddress = "0x" + Math.random().toString(16).slice(2, 10) + "..." + Math.random().toString(16).slice(2, 6)
    const mockBalance = (Math.random() * 10).toFixed(4)
    const chains = ["Ethereum", "Polygon", "BSC", "Avalanche", "Base"]
    const mockChain = chains[Math.floor(Math.random() * chains.length)]

    setIsConnected(true)
    setAddress(mockAddress)
    setBalance(mockBalance)
    setChain(mockChain)

    // Save to localStorage
    localStorage.setItem(
      "wallet",
      JSON.stringify({
        address: mockAddress,
        balance: mockBalance,
        chain: mockChain,
      }),
    )

    // Redirect to home
    router.push("/home")
  }

  const disconnect = () => {
    setIsConnected(false)
    setAddress(null)
    setBalance("0")
    setChain("Ethereum")
    localStorage.removeItem("wallet")
    router.push("/")
  }

  return (
    <WalletContext.Provider value={{ isConnected, address, balance, chain, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  )
}
