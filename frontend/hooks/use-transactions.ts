"use client"

import { useState, useEffect } from "react"
import { useToken } from "@privy-io/react-auth"
import { fetchWithAuth } from "@/lib/api/fetch-with-auth"
import type { Transaction } from "@/lib/types"

export function useTransactions(tokenId: string) {
  const { getAccessToken } = useToken()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetchWithAuth(getAccessToken, `/api/tokens/${tokenId}/transactions`)
        if (response.ok) {
          const data = await response.json()
          setTransactions(data.transactions)
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [tokenId, getAccessToken])

  return { transactions, isLoading }
}
