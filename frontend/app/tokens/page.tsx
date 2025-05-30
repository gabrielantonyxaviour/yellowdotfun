import { TokensGrid } from "@/components/tokens/tokens-grid"
import { TokensFilter } from "@/components/tokens/tokens-filter"
import { Footer } from "@/components/layout/footer"

export default function TokensPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-black yellow-text mb-8">Explore Tokens</h1>

        <TokensFilter />
        <TokensGrid />
      </main>
      <Footer />
    </div>
  )
}
