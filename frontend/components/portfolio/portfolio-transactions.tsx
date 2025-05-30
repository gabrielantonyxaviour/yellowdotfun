"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { formatNumber } from "@/lib/utils"

// Dummy data
const dummyTransactions = [
  {
    id: "1",
    type: "buy",
    symbol: "YDOGE",
    amount: 100000,
    price: 0.0234,
    value: 2340,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "2",
    type: "sell",
    symbol: "PPEPE",
    amount: 50000,
    price: 0.0567,
    value: 2835,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "3",
    type: "buy",
    symbol: "BANANA",
    amount: 200000,
    price: 0.0123,
    value: 2460,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "4",
    type: "buy",
    symbol: "BBULL",
    amount: 500000,
    price: 0.0012,
    value: 600,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
]

export function PortfolioTransactions() {
  return (
    <Card className="yellow-border yellow-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recent Transactions</h2>
        </div>

        <div className="space-y-4">
          {dummyTransactions.map((tx) => (
            <div key={tx.id} className="yellow-border p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                {tx.type === "buy" ? (
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold">
                    {tx.type === "buy" ? "Bought" : "Sold"} {tx.symbol}
                  </h3>
                  <p className="text-sm text-gray-600">{new Date(tx.timestamp).toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-2 flex justify-between items-center">
                <p className="text-sm">
                  {formatNumber(tx.amount)} {tx.symbol} @ ${formatNumber(tx.price)}
                </p>
                <p className="font-bold">${formatNumber(tx.value)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button className="text-sm font-medium text-yellow-600 hover:text-yellow-800">View All Transactions</button>
        </div>
      </CardContent>
    </Card>
  )
}
