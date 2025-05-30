import { Card, CardContent } from "@/components/ui/card";
import { Zap, Shield, BarChart4, Layers } from "lucide-react";

export function FeatureSection() {
  return (
    <section className="bg-white dark:bg-background yellow-section">
      <div className="yellow-container">
        <div className="text-center mb-12">
          <h2 className="yellow-heading">Why Choose yellow.fun</h2>
          <p className="text-xl max-w-3xl mx-auto">
            Our platform offers unique advantages for memecoin traders
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="yellow-card">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-400 p-3 rounded-full yellow-border mr-4">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Ultra-Fast Trading</h3>
              </div>
              <p>
                Powered by Yellow Protocol's Layer-3 state channels, our
                platform enables high-frequency trading with near-instant
                execution, regardless of blockchain congestion.
              </p>
            </CardContent>
          </Card>

          <Card className="yellow-card">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-400 p-3 rounded-full yellow-border mr-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Enhanced Security</h3>
              </div>
              <p>
                Trade with confidence using our non-custodial system. Your funds
                remain secure in smart contracts while you trade across multiple
                chains without counterparty risk.
              </p>
            </CardContent>
          </Card>

          <Card className="yellow-card">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-400 p-3 rounded-full yellow-border mr-4">
                  <BarChart4 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Aggregated Liquidity</h3>
              </div>
              <p>
                Access deep liquidity pools across multiple EVM chains, ensuring
                better prices and reduced slippage for your memecoin trades
                compared to single-chain platforms.
              </p>
            </CardContent>
          </Card>

          <Card className="yellow-card">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-400 p-3 rounded-full yellow-border mr-4">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Multi-Chain Support</h3>
              </div>
              <p>
                Trade memecoins on Ethereum, Polygon, BSC, Avalanche, Base, and
                any other EVM-compatible chain from a single interface without
                bridging assets.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
