"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { Wallet, LogOut, CreditCard, Copy } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { formatAddress } from "@/lib/utils"

export function WalletButton() {
  const { logout, user } = usePrivy()
  const { wallets } = useWallets()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  const activeWallet = wallets[0]
  const address = activeWallet?.address || user?.wallet?.address

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast({
        title: "Address copied!",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const handleFundWallet = () => {
    activeWallet?.fund()
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="cartoon-border cartoon-shadow bg-white hover:bg-yellow-100 text-black font-bold">
          <Wallet className="mr-2 h-4 w-4" />
          {address ? formatAddress(address) : "Wallet"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 cartoon-border cartoon-shadow bg-white">
        <DropdownMenuLabel className="font-bold">My Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {address && (
          <>
            <DropdownMenuItem onClick={handleCopyAddress} className="cursor-pointer">
              <Copy className="mr-2 h-4 w-4" />
              Copy Address
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleFundWallet} className="cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" />
              Fund Wallet
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
