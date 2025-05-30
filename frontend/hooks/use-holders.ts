"use client"

import { useState, useEffect } from "react"
import { useToken } from "@privy-io/react-auth"
import { fetchWithAuth } from "@/lib/api/fetch-with-auth"
import type { Holder } from "@/lib/types"

export function useHolders(tokenId: string) {
  const { getAccessToken } = useToken()
  const [holders, setHolders] = useState<Holder[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchHolders() {
      try {
        const response = await fetchWithAuth(getAccessToken, `/api/tokens/${tokenId}/holders`)
        if (response.ok) {
          const data = await response.json()
          setHolders(data.holders)
        }
      } catch (error) {
        console.error("Failed to fetch holders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHolders()
  }, [tokenId, getAccessToken])

  return { holders, isLoading }
}
