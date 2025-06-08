import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export function AboutYellow() {
  return (
    <section id="about" className="bg-white dark:bg-background yellow-section">
      <div className="yellow-container">
        <div className="text-center mb-12">
          <h2 className="yellow-heading">Powered by Yellow Protocol</h2>
          <p className="text-xl max-w-3xl mx-auto">
            The first ever decentralized clearing system that uses state
            channels to facilitate trading and settlement through smart clearing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="yellow-card">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 p-4 yellow-border border-t-0 border-l-0 border-r-0 mb-4">
                <h3 className="yellow-subheading">Decentralized Clearing</h3>
              </div>
              <p>
                Yellow Network connects multiple exchanges to share liquidity
                instantly, solving the problem of fragmentation in the crypto
                trading landscape.
              </p>
            </CardContent>
          </Card>

          <Card className="yellow-card">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 p-4 yellow-border border-t-0 border-l-0 border-r-0 mb-4">
                <h3 className="yellow-subheading">Non-Custodial</h3>
              </div>
              <p>
                Exchanges don't hold users' funds - they are locked with secure
                multisig smart contracts and wallet based on MetaMask's
                technology.
              </p>
            </CardContent>
          </Card>

          <Card className="yellow-card">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 p-4 yellow-border border-t-0 border-l-0 border-r-0 mb-4">
                <h3 className="yellow-subheading">Cross-Chain Markets</h3>
              </div>
              <p>
                Yellow Network has connection points in every major blockchain
                for cross-chain collateral and settlements, enabling seamless
                trading.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 relative h-[400px]">
          <Image
            src="/placeholder.svg?height=400&width=1200"
            alt="Yellow Protocol Architecture"
            fill
            className="object-contain yellow-border yellow-shadow rounded-lg"
          />
        </div>
      </div>
    </section>
  );
}
