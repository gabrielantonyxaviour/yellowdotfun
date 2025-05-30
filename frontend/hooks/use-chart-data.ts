"use client"

import { useState, useEffect } from "react"
import { useToken } from "@privy-io/react-auth"
import { fetchWithAuth } from "@/lib/api/fetch-with-auth"
import type { ChartData } from "@/lib/types"

export function useChartData(tokenId: string) {
  const { getAccessToken } = useToken()
  const [data, setData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchChartData() {
      try {
        const response = await fetchWithAuth(getAccessToken, `/api/tokens/${tokenId}/chart`)
        if (response.ok) {
          const result = await response.json()
          setData(result.data)
        }
      } catch (error) {
        console.error("Failed to fetch chart data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChartData()
  }, [tokenId, getAccessToken])

  return { data, isLoading }
}
