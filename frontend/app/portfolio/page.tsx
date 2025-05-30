import { AppHeader } from "@/components/layout/app-header";
import { PortfolioOverview } from "@/components/portfolio/portfolio-overview";
import { PortfolioTokens } from "@/components/portfolio/portfolio-tokens";
import { PortfolioTransactions } from "@/components/portfolio/portfolio-transactions";
import { Footer } from "@/components/layout/footer";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-black yellow-text mb-8">Your Portfolio</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <PortfolioOverview />
          </div>
          <div className="lg:col-span-2">
            <PortfolioTokens />
          </div>
          <div className="lg:col-span-1">
            <PortfolioTransactions />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
