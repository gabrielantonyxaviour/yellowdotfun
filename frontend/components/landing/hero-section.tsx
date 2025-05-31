import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="bg-yellow-400 py-20 px-4">
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
              <Link href="/home">
                <Button size="lg" className="launch-btn">
                  Launch App
                </Button>
              </Link>
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
