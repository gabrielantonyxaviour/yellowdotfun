"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send } from "lucide-react";

export function ContactSection() {
  return (
    <section className="bg-black text-white yellow-section">
      <div className="yellow-container">
        <div className="text-center mb-12">
          <h2 className="yellow-heading text-yellow-400">Join Our Community</h2>
          <p className="text-xl max-w-3xl mx-auto">
            Be part of the revolution in memecoin trading
          </p>
        </div>

        <div className="flex justify-center">
          <Card className="yellow-card bg-yellow-400 text-black max-w-md w-full">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-black mb-6">
                Join Our Telegram Group
              </h3>
              <p className="mb-6">
                Connect with other traders, get updates, and be the first to
                know about new features and tokens.
              </p>
              <Button
                className="yellow-button bg-black text-yellow-400 w-full"
                onClick={() =>
                  window.open("https://t.me/yellowdotfun", "_blank")
                }
              >
                <Send className="mr-2 h-5 w-5" />
                Join Telegram
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
