"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  type UTCTimestamp,
  type IChartApi,
  type CandlestickData,
  type HistogramData,
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
): { candlestickData: CandlestickData[]; volumeData: HistogramData[] } {
  if (!transactions.length) return { candlestickData: [], volumeData: [] };

  const sorted = [...transactions].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const intervals: { [key: string]: Transaction[] } = {};
  const intervalMs = getIntervalMs(timeframe);

  sorted.forEach((tx) => {
    const timestamp = new Date(tx.timestamp).getTime();
    const intervalStart = Math.floor(timestamp / intervalMs) * intervalMs;
    const key = intervalStart.toString();

    if (!intervals[key]) intervals[key] = [];
    intervals[key].push(tx);
  });

  const candlestickData: CandlestickData[] = [];
  const volumeData: HistogramData[] = [];

  Object.entries(intervals).forEach(([timestamp, txs]) => {
    const prices = txs.map((tx) => tx.usd_amount / tx.token_amount);
    const volume = txs.reduce((sum, tx) => sum + tx.usd_amount, 0);
    const time = (parseInt(timestamp) / 1000) as UTCTimestamp;

    const open = prices[0];
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    const close = prices[prices.length - 1];

    candlestickData.push({
      time,
      open,
      high,
      low,
      close,
    });

    volumeData.push({
      time,
      value: volume,
      color: close >= open ? "#facc15aa" : "#ef4444aa", // Yellow/red with transparency
    });
  });

  return {
    candlestickData: candlestickData.sort(
      (a, b) => (a.time as number) - (b.time as number)
    ),
    volumeData: volumeData.sort(
      (a, b) => (a.time as number) - (b.time as number)
    ),
  };
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
        background: { type: ColorType.Solid, color: "transparent" }, // Transparent to use parent bg
        textColor: "#ffffff",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: 12,
      },
      grid: {
        vertLines: { color: "#374151", style: 1 }, // gray-700
        horzLines: { color: "#374151", style: 1 },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      rightPriceScale: {
        borderColor: "#6b7280", // gray-500
        scaleMargins: { top: 0.1, bottom: 0.3 },
      },
      timeScale: {
        borderColor: "#6b7280",
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 1,
        vertLine: { color: "#facc15", style: 3, width: 1 }, // yellow-400
        horzLine: { color: "#facc15", style: 3, width: 1 },
      },
    });

    // Candlestick series
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e", // green-500
      downColor: "#ef4444", // red-500
      borderVisible: false,
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
      priceFormat: {
        type: "price",
        precision: 6,
        minMove: 0.000001,
      },
    });

    // Volume series
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: "#facc15", // yellow-400
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
    <div className="bg-stone-800 rounded-lg">
      {/* Timeframe buttons */}
      <div className="flex gap-2 p-4 border-b border-gray-700">
        {["1M", "5M", "15M", "1H", "4H", "1D"].map((tf) => (
          <Button
            key={tf}
            variant="outline"
            size="sm"
            className={`font-bold border transition-all ${
              timeframe === tf
                ? "bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-400 text-black border-yellow-500"
                : "bg-stone-700 text-white border-gray-600 hover:bg-stone-600 hover:border-gray-500"
            }`}
            onClick={() => setTimeframe(tf)}
          >
            {tf}
          </Button>
        ))}
      </div>

      {/* Chart container */}
      <div className="p-4">
        <div
          ref={chartContainerRef}
          className="w-full h-[500px] rounded-lg bg-stone-900"
        />
      </div>
    </div>
  );
}
