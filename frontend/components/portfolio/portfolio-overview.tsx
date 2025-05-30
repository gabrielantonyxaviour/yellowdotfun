"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, PieChart, TrendingUp, Wallet } from "lucide-react"
import { formatNumber } from "@/lib/utils"

export function PortfolioOverview() {
  return (
    <Card className="yellow-border yellow-shadow mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Portfolio Overview</h2>
            <p className="text-gray-500">Last updated: {new Date().toLocaleString()}</p>
          </div>
          <Tabs defaultValue="value">
            <TabsList className="yellow-border">
              <TabsTrigger value="value">Value</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="yellow-border bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium">Total Value</span>
              </div>
              <p className="text-2xl font-bold">${formatNumber(12567.89)}</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +5.67% today
              </p>
            </CardContent>
          </Card>

          <Card className="yellow-border bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium">Tokens Owned</span>
              </div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-gray-600">Across 3 chains</p>
            </CardContent>
          </Card>

          <Card className="yellow-border bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium">Best Performer</span>
              </div>
              <p className="text-2xl font-bold">YDOGE</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +120.45% (24h)
              </p>
            </CardContent>
          </Card>

          <Card className="yellow-border bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium">Total Profit/Loss</span>
              </div>
              <p className="text-2xl font-bold text-green-600">+$3,456.78</p>
              <p className="text-sm text-gray-600">All time</p>
            </CardContent>
          </Card>
        </div>

        <div className="relative h-[300px] yellow-border rounded-lg bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500 font-medium">Portfolio Value Chart</p>
        </div>
      </CardContent>
    </Card>
  )
}
