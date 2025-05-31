"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"

export function TokensFilter() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input placeholder="Search tokens..." className="pl-10 yellow-border" />
        </div>
        <Button variant="outline" className="yellow-button" onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {isFiltersOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 yellow-border rounded-lg mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Chain</label>
            <Select defaultValue="all">
              <SelectTrigger className="yellow-border">
                <SelectValue placeholder="Select chain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chains</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
                <SelectItem value="bsc">BSC</SelectItem>
                <SelectItem value="avalanche">Avalanche</SelectItem>
                <SelectItem value="base">Base</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sort By</label>
            <Select defaultValue="volume">
              <SelectTrigger className="yellow-border">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="volume">Volume</SelectItem>
                <SelectItem value="marketcap">Market Cap</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="change">24h Change</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price Range</label>
            <div className="flex items-center gap-2">
              <Input type="number" placeholder="Min" className="yellow-border" />
              <span>to</span>
              <Input type="number" placeholder="Max" className="yellow-border" />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="yellow-border bg-yellow-400 text-black">
          All
        </Button>
        <Button variant="outline" size="sm" className="yellow-border">
          Trending
        </Button>
        <Button variant="outline" size="sm" className="yellow-border">
          New
        </Button>
        <Button variant="outline" size="sm" className="yellow-border">
          Top Gainers
        </Button>
        <Button variant="outline" size="sm" className="yellow-border">
          Top Losers
        </Button>
      </div>
    </div>
  )
}
