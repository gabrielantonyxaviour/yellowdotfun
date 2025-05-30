"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"

export function HomeHero() {
  return (
    <div className="mb-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <h1 className="text-4xl font-black yellow-text">Explore Memecoins</h1>
        <Link href="/create">
          <Button className="yellow-button text-lg">Start a Coin</Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input placeholder="Search by name or symbol..." className="yellow-border pl-12 py-6 text-lg" />
      </div>
    </div>
  )
}
