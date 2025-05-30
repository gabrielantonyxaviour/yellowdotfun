"use client"

import { useState, useEffect } from "react"
import { useToken as usePrivyToken } from "@privy-io/react-auth"
import { fetchWithAuth } from "@/lib/api/fetch-with-auth"
import type { Token } from "@/lib/types"

export function useTrendingTokens() {
  const { getAccessToken } = usePrivyToken()
  const [tokens, setTokens] = useState<Token[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchTokens() {
      try {
        const response = await fetchWithAuth(getAccessToken, "/api/tokens/trending")
        if (response.ok) {
          const data = await response.json()
          setTokens(data.tokens)
        }
      } catch (error) {
        console.error("Failed to fetch trending tokens:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTokens()
  }, [getAccessToken])

  return { tokens, isLoading }
}

export function useRecentTokens() {
  const { getAccessToken } = usePrivyToken()
  const [tokens, setTokens] = useState<Token[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchTokens() {
      try {
        const response = await fetchWithAuth(getAccessToken, "/api/tokens/recent")
        if (response.ok) {
          const data = await response.json()
          setTokens(data.tokens)
        }
      } catch (error) {
        console.error("Failed to fetch recent tokens:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTokens()
  }, [getAccessToken])

  return { tokens, isLoading }
}

export function useToken(tokenId: string) {
  const { getAccessToken } = usePrivyToken()
  const [token, setToken] = useState<Token | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchToken() {
      try {
        const response = await fetchWithAuth(getAccessToken, `/api/tokens/${tokenId}`)
        if (response.ok) {
          const data = await response.json()
          setToken(data.token)
        }
      } catch (error) {
        console.error("Failed to fetch token:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchToken()
  }, [tokenId, getAccessToken])

  return { token, isLoading }
}
