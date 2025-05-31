"use client";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function TeamSection() {
  const [showPrague, setShowPrague] = useState(false);
  return (
    <section className="bg-yellow-400 yellow-section">
      <div className="yellow-container">
        <div className="text-center mb-12">
          <h2 className="yellow-heading">Meet the Team</h2>
        </div>

        <div className="flex justify-center">
          <Card className="yellow-card max-w-2xl">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center md:space-x-8">
                <div className="relative w-48 h-48 yellow-border yellow-shadow rounded-full overflow-hidden">
                  <Image
                    src="/gabriel.jpg"
                    alt="Gabriel"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="">
                  <h3 className="text-2xl font-black">
                    Gabriel Antony Xaviour
                  </h3>
                  <p className="font-medium mt-2">
                    dev @{" "}
                    <Link
                      href="https://x.com/JUXTAMODE"
                      target="_blank"
                      className="text-black font-bold hover:underline"
                    >
                      JUXTAMODE
                    </Link>
                  </p>
                  <p>coding, trading, anime</p>
                  <p>60x hackathon winner</p>

                  <Link
                    href="https://twitter.com/gabrielaxyeth"
                    target="_blank"
                    className="text-black flex space-x-2 items-center hover:underline"
                  >
                    <Image
                      src="/x.png"
                      alt="X"
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <p className="font-bold">gabrielaxyeth</p>
                  </Link>

                  <div className="flex flex-col items-center w-full justify-center my-3">
                    <Image
                      src="/ethglobal.jpg"
                      alt="ETHGlobal"
                      width={32}
                      height={32}
                    />
                    <p className="font-bold text-lg">4x ETHGlobal Finalist</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-yellow-400 yellow-border p-4 text-center flex flex-col items-center space-y-2">
                      <Image
                        src="/superhack.png"
                        alt="Superhack"
                        width={32}
                        height={32}
                      />
                      <p className="font-bold text-sm">Superhack 2023</p>
                    </div>
                    <div className="bg-yellow-400 yellow-border p-4 text-center flex flex-col items-center space-y-2">
                      <Image
                        src="/circuit.png"
                        alt="Circuit Breaker"
                        width={32}
                        height={32}
                      />
                      <p className="font-bold text-sm">Circuit Breaker 2024</p>
                    </div>
                    <div className="bg-yellow-400 yellow-border p-4 text-center flex flex-col items-center space-y-2">
                      <Image
                        src="/frameworks.png"
                        alt="Frameworks"
                        width={32}
                        height={32}
                      />
                      <p className="font-bold text-sm">Frameworks 2024</p>
                    </div>
                    <div className="bg-yellow-400 yellow-border p-4 text-center flex flex-col items-center space-y-2">
                      <Image
                        src="/trifecta.png"
                        alt="Trifecta"
                        width={32}
                        height={32}
                      />
                      <p className="font-bold text-sm">Trifecta 1st Place</p>
                    </div>
                  </div>

                  {showPrague && (
                    <div className="bg-yellow-400 yellow-border p-4 text-center flex flex-col items-center space-y-2">
                      <Image
                        src="/prague.png"
                        alt="Prague"
                        width={32}
                        height={32}
                      />
                      <p className="font-bold text-sm">
                        ETHGlobal Prague 2025 Finalist
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
