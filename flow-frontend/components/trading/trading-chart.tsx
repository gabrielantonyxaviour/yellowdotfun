"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  type UTCTimestamp,
  type IChartApi,
  type CandlestickData,
  CandlestickSeries,
  HistogramSeries,
} from "lightweight-charts";
import { Button } from "@/components/ui/button";
import { type Transaction } from "@/lib/supabase";

interface TradingChartProps {
  tokenId: string;
  transactions: Transaction[];
}

// Convert transactions to OHLCV data
function processTransactionsToOHLCV(
  transactions: Transaction[],
  timeframe: string
): CandlestickData[] {
  if (!transactions.length) return [];

  // Sort by timestamp
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Group by time intervals
  const intervals: { [key: string]: Transaction[] } = {};
  const intervalMs = getIntervalMs(timeframe);

  sorted.forEach((tx) => {
    const timestamp = new Date(tx.timestamp).getTime();
    const intervalStart = Math.floor(timestamp / intervalMs) * intervalMs;
    const key = intervalStart.toString();

    if (!intervals[key]) intervals[key] = [];
    intervals[key].push(tx);
  });

  // Convert to OHLCV
  return Object.entries(intervals)
    .map(([timestamp, txs]) => {
      const prices = txs.map((tx) => tx.usd_amount / tx.token_amount);
      const volume = txs.reduce((sum, tx) => sum + tx.usd_amount, 0);

      return {
        time: (parseInt(timestamp) / 1000) as UTCTimestamp,
        open: prices[0],
        high: Math.max(...prices),
        low: Math.min(...prices),
        close: prices[prices.length - 1],
        volume,
      };
    })
    .sort((a, b) => a.time - b.time);
}

function getIntervalMs(timeframe: string): number {
  switch (timeframe) {
    case "1M":
      return 60 * 1000;
    case "5M":
      return 5 * 60 * 1000;
    case "15M":
      return 15 * 60 * 1000;
    case "1H":
      return 60 * 60 * 1000;
    case "4H":
      return 4 * 60 * 60 * 1000;
    case "1D":
      return 24 * 60 * 60 * 1000;
    default:
      return 60 * 1000;
  }
}

export function TradingChart({ tokenId, transactions }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);
  const [timeframe, setTimeframe] = useState("5M");

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#0d1421" },
        textColor: "#d1d4dc",
        fontFamily:
          "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: 12,
      },
      grid: {
        vertLines: { color: "#2a2e39", style: 1 },
        horzLines: { color: "#2a2e39", style: 1 },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      rightPriceScale: {
        borderColor: "#485158",
        scaleMargins: { top: 0.1, bottom: 0.3 },
      },
      timeScale: {
        borderColor: "#485158",
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 1,
        vertLine: { color: "#758696", style: 3, width: 1 },
        horzLine: { color: "#758696", style: 3, width: 1 },
      },
    });

    // Candlestick series
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#00d4aa",
      downColor: "#ff4976",
      borderVisible: false,
      wickUpColor: "#00d4aa",
      wickDownColor: "#ff4976",
      priceFormat: {
        type: "price",
        precision: 6,
        minMove: 0.000001,
      },
    });

    // Volume series
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: "#26a69a",
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });

    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;
    volumeSeriesRef.current = volumeSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  // Update chart data when transactions change
  useEffect(() => {
    if (
      !chartRef.current ||
      !candlestickSeriesRef.current ||
      !volumeSeriesRef.current
    ) {
      return;
    }

    const { candlestickData, volumeData } = processTransactionsToOHLCV(
      transactions,
      timeframe
    );

    if (candlestickData.length > 0) {
      candlestickSeriesRef.current.setData(candlestickData);
      volumeSeriesRef.current.setData(volumeData);

      // Auto-fit content
      setTimeout(() => {
        chartRef.current?.timeScale().fitContent();
      }, 100);
    }
  }, [transactions, timeframe]);

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        {["1M", "5M", "15M", "1H", "4H", "1D"].map((tf) => (
          <Button
            key={tf}
            variant="outline"
            size="sm"
            className={`font-bold ${
              timeframe === tf
                ? "bg-[#00d4aa] text-black border-[#00d4aa]"
                : "bg-[#1e2329] text-[#d1d4dc] border-[#2a2e39] hover:bg-[#2a2e39]"
            }`}
            onClick={() => setTimeframe(tf)}
          >
            {tf}
          </Button>
        ))}
      </div>

      <div
        ref={chartContainerRef}
        className="w-full h-[500px] bg-[#0d1421] rounded-lg"
      />
    </div>
  );
}
