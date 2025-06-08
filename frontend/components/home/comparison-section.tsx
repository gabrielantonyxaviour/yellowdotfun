import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";

export function ComparisonSection() {
  return (
    <section className="bg-black text-white yellow-section">
      <div className="yellow-container">
        <div className="text-center mb-12">
          <h2 className="yellow-heading text-yellow-400">
            EVM vs Solana Memecoin Trading
          </h2>
          <p className="text-xl max-w-3xl mx-auto">
            See how yellow.fun compares to Solana's PumpFun platform
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="yellow-card bg-yellow-400 text-black">
            <CardContent className="p-6">
              <h3 className="text-3xl font-black mb-6 text-center">
                yellow.fun
              </h3>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Check className="h-6 w-6 mr-2 text-black" />
                  <span className="font-bold">
                    Multi-chain support for all EVM chains
                  </span>
                </div>
                <div className="flex items-center">
                  <Check className="h-6 w-6 mr-2 text-black" />
                  <span className="font-bold">
                    State channel technology for instant trading
                  </span>
                </div>
                <div className="flex items-center">
                  <Check className="h-6 w-6 mr-2 text-black" />
                  <span className="font-bold">
                    Non-custodial trading with secure smart contracts
                  </span>
                </div>
                <div className="flex items-center">
                  <Check className="h-6 w-6 mr-2 text-black" />
                  <span className="font-bold">
                    Cross-chain liquidity aggregation
                  </span>
                </div>
                <div className="flex items-center">
                  <Check className="h-6 w-6 mr-2 text-black" />
                  <span className="font-bold">
                    Trade in USD value across any chain
                  </span>
                </div>
                <div className="flex items-center">
                  <Check className="h-6 w-6 mr-2 text-black" />
                  <span className="font-bold">
                    High-frequency trading capabilities
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="yellow-card bg-white text-black">
            <CardContent className="p-6">
              <h3 className="text-3xl font-black mb-6 text-center">
                PumpFun (Solana)
              </h3>

              <div className="space-y-4">
                <div className="flex items-center">
                  <X className="h-6 w-6 mr-2 text-red-500" />
                  <span className="font-bold">
                    Limited to Solana blockchain only
                  </span>
                </div>
                <div className="flex items-center">
                  <X className="h-6 w-6 mr-2 text-red-500" />
                  <span className="font-bold">
                    Traditional on-chain trading with delays
                  </span>
                </div>
                <div className="flex items-center">
                  <Check className="h-6 w-6 mr-2 text-green-500" />
                  <span className="font-bold">Non-custodial trading</span>
                </div>
                <div className="flex items-center">
                  <X className="h-6 w-6 mr-2 text-red-500" />
                  <span className="font-bold">
                    Limited to Solana's liquidity
                  </span>
                </div>
                <div className="flex items-center">
                  <X className="h-6 w-6 mr-2 text-red-500" />
                  <span className="font-bold">
                    Cannot trade across multiple chains
                  </span>
                </div>
                <div className="flex items-center">
                  <Check className="h-6 w-6 mr-2 text-green-500" />
                  <span className="font-bold">
                    Fast but limited to Solana's throughput
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
