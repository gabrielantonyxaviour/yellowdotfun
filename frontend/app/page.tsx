import { LandingHeader } from "@/components/landing/landing-header";
import { HeroSection } from "@/components/landing/hero-section";
import { AboutYellow } from "@/components/home/about-yellow";
import { ComparisonSection } from "@/components/home/comparison-section";
import { FeatureSection } from "@/components/home/feature-section";
import { TeamSection } from "@/components/home/team-section";
import { ContactSection } from "@/components/home/contact-section";
import { Footer } from "@/components/layout/footer";
import { WalletProvider } from "@/contexts/wallet-context";

export default function LandingPage() {
  return (
    <WalletProvider>
      <div className="min-h-screen">
        <LandingHeader />
        <main>
          <HeroSection />
          <AboutYellow />
          <ComparisonSection />
          <FeatureSection />
          <TeamSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </WalletProvider>
  );
}
