import { HeroSection } from "@/components/landing/hero-section";
import { AboutYellow } from "@/components/landing/about-yellow";
import { ComparisonSection } from "@/components/landing/comparison-section";
import { FeatureSection } from "@/components/landing/feature-section";
import { TeamSection } from "@/components/landing/team-section";
import { ContactSection } from "@/components/landing/contact-section";
import { Footer } from "@/components/layout/footer";

import { AppHeader } from "@/components/layout/app-header";

export default function LandingPage() {
  return (
    <main>
      <AppHeader />
      <HeroSection />
      <AboutYellow />
      <ComparisonSection />
      <FeatureSection />
      <TeamSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
