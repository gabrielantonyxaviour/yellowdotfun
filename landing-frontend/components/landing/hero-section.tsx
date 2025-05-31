import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 py-20 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-black yellow-text mb-6">
              The Next Gen Memecoin Trading App
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-bold">
              Faster, cheaper, and EVM-secured alternative for pump.fun, built
              using ERC7824
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="launch-btn flex space-x-2 items-center"
                onClick={() => {
                  window.open(
                    "https://worldcoin.org/mini-app?app_id=app_3134f79d914ce1284d8afce0921050fe&draft_id=meta_a10470c50f82786e18d6c664f5c8cfabn",
                    "_blank"
                  );
                }}
              >
                <Image src="/world.png" alt="World" width={20} height={20} />
                Launch Mini App
              </Button>
              <Button
                size="lg"
                className="launch-btn flex space-x-2 items-center"
                onClick={() => {
                  window.open("https://yellowdotfun.vercel.app", "_blank");
                }}
              >
                <Image src="/flow.png" alt="flow" width={20} height={20} />
                Launch Web App
              </Button>
            </div>
          </div>
          <div className="relative h-[400px]">
            <Image
              src="/placeholder.svg?height=400&width=500"
              alt="EVM Memecoin Trading Platform"
              fill
              className="object-contain yellow-border yellow-shadow rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
