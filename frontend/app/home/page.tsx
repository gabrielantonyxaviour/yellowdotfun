import { AppHeader } from "@/components/layout/app-header";
import { HomeHero } from "@/components/home/home-hero";
import { KingOfHill } from "@/components/home/king-of-hill";
import { TokensGrid } from "@/components/home/tokens-grid";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <HomeHero />
        <KingOfHill />
        <TokensGrid />
      </main>
      <Footer />
    </div>
  );
}
