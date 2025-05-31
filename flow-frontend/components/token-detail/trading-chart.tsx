"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  type UTCTimestamp,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type HistogramData,
  SeriesType,
  CandlestickSeries,
  HistogramSeries,
} from "lightweight-charts";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface TradingChartProps {
  tokenId: string;
}

// Generate realistic price data
function generatePriceData(
  days: number,
  startPrice: number,
  volatility: number
) {
  const data = [];
  let currentPrice = startPrice;
  const now = new Date();

  // Generate a pump and dump pattern
  const pumpPhase = days * 0.3; // 30% of time for pump
  const dumpPhase = days * 0.2; // 20% of time for dump
  const recoveryPhase = days * 0.5; // 50% of time for recovery

  for (let i = days; i >= 0; i--) {
    const time = new Date(now);
    time.setDate(now.getDate() - i);

    let trend = 0;
    let volatilityMultiplier = 1;

    // Pump phase
    if (i > days - pumpPhase) {
      trend = 0.02; // Strong uptrend
      volatilityMultiplier = 1.5; // Higher volatility during pump
    }
    // Dump phase
    else if (i > days - pumpPhase - dumpPhase) {
      trend = -0.015; // Strong downtrend
      volatilityMultiplier = 2; // Highest volatility during dump
    }
    // Recovery phase
    else {
      trend = 0.005; // Slight uptrend
      volatilityMultiplier = 1.2; // Moderate volatility
    }

    // Add some random noise
    const noise = (Math.random() - 0.5) * volatility * volatilityMultiplier;
    currentPrice = Math.max(0.0001, currentPrice * (1 + trend + noise));

    // Generate intraday volatility
    const open = currentPrice * (1 + (Math.random() - 0.5) * 0.02);
    const high = Math.max(open, currentPrice) * (1 + Math.random() * 0.03);
    const low = Math.min(open, currentPrice) * (1 - Math.random() * 0.03);
    const close = currentPrice;

    // Generate volume with correlation to price movement
    const priceChange = Math.abs(close - open) / open;
    const baseVolume = 100000;
    const volumeMultiplier = 1 + priceChange * 10; // Higher volume on bigger moves
    const volume = Math.floor(
      baseVolume * volumeMultiplier * (1 + Math.random() * 0.5)
    );

    data.push({
      time: (time.getTime() / 1000) as UTCTimestamp,
      open,
      high,
      low,
      close,
      volume,
    });
  }

  return data;
}

export function TradingChart({ tokenId }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeframe, setTimeframe] = useState("1D");

  useEffect(() => {
    if (!chartContainerRef.current) {
      console.log("Chart container ref is null");
      return;
    }

    console.log("Chart container dimensions:", {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    setIsLoading(true);

    // Generate data based on timeframe
    let days = 1;
    switch (timeframe) {
      case "1D":
        days = 1;
        break;
      case "1W":
        days = 7;
        break;
      case "1M":
        days = 30;
        break;
      case "3M":
        days = 90;
        break;
      case "1Y":
        days = 365;
        break;
      default:
        days = 1;
    }

    const data = generatePriceData(days, 0.0234, 0.05);
    console.log("Generated data:", data.slice(0, 3)); // Log first 3 items
    console.log("Data length:", data.length);

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "white" },
        textColor: "black",
        fontFamily: "'Inter', sans-serif",
      },
      grid: {
        vertLines: { color: "#e0e0e0", style: 1 },
        horzLines: { color: "#e0e0e0", style: 1 },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: "#000000",
        tickMarkFormatter: (time: number) => {
          const date = new Date(time * 1000);
          return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        },
      },
      rightPriceScale: {
        borderColor: "#000000",
        scaleMargins: {
          top: 0.1,
          bottom: 0.5, // Leave space for volume
        },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: "#000000",
          style: 1,
          width: 1,
        },
        horzLine: {
          color: "#000000",
          style: 1,
          width: 1,
        },
      },
    });

    console.log("Chart created:", chart);

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderVisible: true,
      borderUpColor: "#22c55e",
      borderDownColor: "#ef4444",
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
      priceFormat: {
        type: "price",
        precision: 6,
        minMove: 0.000001,
      },
    });

    console.log("Candlestick series created:", candlestickSeries);

    try {
      candlestickSeries.setData(data);
      console.log("Candlestick data set successfully");
    } catch (error) {
      console.error("Error setting candlestick data:", error);
    }

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: "#22c55e",
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "volume", // Use named scale instead of empty string
    });

    volumeSeries.setData(
      data.map((item) => ({
        time: item.time,
        value: item.volume,
        color: item.close > item.open ? "#22c55e" : "#ef4444",
      }))
    );

    // Set scale margins on the volume price scale
    chart.priceScale("volume").applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);
    setIsLoading(false);

    setTimeout(() => {
      chart.timeScale().fitContent();
    }, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [timeframe, tokenId]);

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        {["1D", "1W", "1M", "3M", "1Y"].map((tf) => (
          <Button
            key={tf}
            variant="outline"
            size="sm"
            className={`yellow-border ${
              timeframe === tf ? "bg-yellow-400 text-black" : ""
            }`}
            onClick={() => setTimeframe(tf)}
          >
            {tf}
          </Button>
        ))}
      </div>

      <div ref={chartContainerRef} className="w-full h-[400px]" />
      {isLoading && <Skeleton className="absolute inset-0 h-[400px] w-full" />}
    </div>
  );
}
