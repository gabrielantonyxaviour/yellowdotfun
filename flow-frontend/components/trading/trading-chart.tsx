"use client"

import { useEffect, useRef } from "react"
import { createChart, ColorType } from "lightweight-charts"
import { useChartData } from "@/hooks/use-chart-data"
import { Skeleton } from "@/components/ui/skeleton"

interface TradingChartProps {
  tokenId: string
}

export function TradingChart({ tokenId }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const { data, isLoading } = useChartData(tokenId)

  useEffect(() => {
    if (!chartContainerRef.current || !data) return

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "white" },
        textColor: "black",
      },
      grid: {
        vertLines: { color: "#e0e0e0" },
        horzLines: { color: "#e0e0e0" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    })

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    })

    candlestickSeries.setData(data)

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth })
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      chart.remove()
    }
  }, [data])

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />
  }

  return <div ref={chartContainerRef} className="w-full h-[400px]" />
}
