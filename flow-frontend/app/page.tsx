import { HomeHero } from "@/components/home/home-hero";
import { KingOfHill } from "@/components/home/king-of-hill";
import { TokensGrid } from "@/components/home/tokens-grid";

export default function HomePage() {
  return (
    <main className="px-4 pb-20">
      <HomeHero />
      <KingOfHill />
      <TokensGrid />
    </main>
  );
}
