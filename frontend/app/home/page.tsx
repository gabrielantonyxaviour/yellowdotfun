// HomePage.tsx
import { AppHeader } from "@/components/layout/app-header";
import { HomeHero } from "@/components/home/home-hero";
import { KingOfHill } from "@/components/home/king-of-hill";
import { TokensGrid } from "@/components/home/tokens-grid";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <main className="px-4 pb-20">
      <HomeHero />
      <KingOfHill />
      <TokensGrid />
    </main>
  );
}
