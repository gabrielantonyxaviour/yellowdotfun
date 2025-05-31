import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export function TeamSection() {
  return (
    <section className="bg-yellow-400 yellow-section">
      <div className="yellow-container">
        <div className="text-center mb-12">
          <h2 className="yellow-heading">Meet the Team</h2>
        </div>

        <div className="flex justify-center">
          <Card className="yellow-card max-w-2xl">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative w-48 h-48 yellow-border yellow-shadow rounded-full overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=200&width=200"
                    alt="Gabriel"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-2">Gabriel</h3>
                  <p className="font-bold mb-4">60x Hackathon Winner</p>
                  <p className="mb-4">Coding, Trading, Anime</p>
                  <Link
                    href="https://twitter.com/gabrielaxyeth"
                    target="_blank"
                    className="text-blue-600 font-bold"
                  >
                    @gabrielaxyeth
                  </Link>

                  <div className="mt-6 grid grid-cols-2 gap-2">
                    <div className="bg-yellow-400 yellow-border p-2 text-center">
                      <p className="font-bold text-sm">4x ETHGlobal Finalist</p>
                    </div>
                    <div className="bg-yellow-400 yellow-border p-2 text-center">
                      <p className="font-bold text-sm">
                        ETHGlobal Superhack 2023
                      </p>
                    </div>
                    <div className="bg-yellow-400 yellow-border p-2 text-center">
                      <p className="font-bold text-sm">
                        ETHGlobal Circuit Breaker 2024
                      </p>
                    </div>
                    <div className="bg-yellow-400 yellow-border p-2 text-center">
                      <p className="font-bold text-sm">
                        ETHGlobal Frameworks 2024
                      </p>
                    </div>
                    <div className="bg-yellow-400 yellow-border p-2 text-center">
                      <p className="font-bold text-sm">
                        ETHGlobal Trifecta 2025 Agents Track 1st
                      </p>
                    </div>
                    <div className="bg-yellow-400 yellow-border p-2 text-center">
                      <p className="font-bold text-sm">
                        ETHGlobal Prague 2025 Finalist
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
