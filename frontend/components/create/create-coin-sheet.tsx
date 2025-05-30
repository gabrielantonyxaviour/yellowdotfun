// components/create/create-coin-sheet.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Upload,
  X,
  Twitter,
  MessageCircle,
  Globe,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

interface CreateCoinSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  name: string;
  symbol: string;
  image: File | null;
  description: string;
  twitter: string;
  telegram: string;
  website: string;
  creatorPercentage: number[];
  liquidityAmount: string;
}

export function CreateCoinSheet({ open, onOpenChange }: CreateCoinSheetProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    symbol: "",
    image: null,
    description: "",
    twitter: "",
    telegram: "",
    website: "",
    creatorPercentage: [10],
    liquidityAmount: "",
  });

  const totalSteps = 4;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    console.log("Creating coin:", formData);
    setStep(5); // Success step
  };

  const isStep1Valid = formData.name && formData.symbol && formData.image;
  const isStep2Valid = formData.description.length >= 10;
  const isStep4Valid =
    formData.liquidityAmount && parseFloat(formData.liquidityAmount) > 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[90vh] rounded-t-3xl border-t-2 border-black"
      >
        <SheetHeader className="pb-6">
          <SheetTitle className="text-2xl font-black text-black text-start mb-4">
            {step === 5 ? "Success!" : "Create Your Coin"}
          </SheetTitle>

          {/* Progress Bar */}
          {step <= totalSteps && (
            <div className="flex gap-1 mt-4">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full ${
                    i + 1 <= step ? "bg-yellow-400" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto pb-8">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-black mb-2">
                  Basic Information
                </h3>
                <p className="text-gray-600">Let's start with the basics</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-black">
                  Coin Image *
                </Label>
                <div className="flex justify-center">
                  <div className="relative">
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center w-32 h-32 border-4 border-dashed border-gray-300 rounded-full cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden"
                    >
                      {formData.image ? (
                        <img
                          src={URL.createObjectURL(formData.image)}
                          alt="Coin preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <Upload className="w-8 h-8 mb-1 text-gray-400" />
                          <p className="text-xs text-gray-500 font-medium text-center px-2">
                            Upload
                          </p>
                        </div>
                      )}
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
              </div>

              {/* Coin Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-bold text-black">
                  Coin Name *
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Yellow Doge"
                  className="yellow-border rounded-xl py-3 text-base"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              {/* Symbol */}
              <div className="space-y-2">
                <Label
                  htmlFor="symbol"
                  className="text-sm font-bold text-black"
                >
                  Symbol *
                </Label>
                <Input
                  id="symbol"
                  placeholder="e.g. YDOGE"
                  className="yellow-border rounded-xl py-3 text-base uppercase"
                  value={formData.symbol}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      symbol: e.target.value.toUpperCase(),
                    })
                  }
                  maxLength={10}
                />
                <p className="text-xs text-gray-500">Max 10 characters</p>
              </div>

              <Button
                onClick={nextStep}
                className="w-full yellow-button py-4 text-lg font-bold rounded-xl"
                disabled={!isStep1Valid}
              >
                Next Step
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Step 2: Description */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-black mb-2">
                  About Your Coin
                </h3>
                <p className="text-gray-600">Tell the world about your coin</p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-bold text-black"
                >
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your coin, its purpose, and what makes it special..."
                  className="yellow-border rounded-xl text-base resize-none h-32"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 text-right">
                  {formData.description.length}/500 (minimum 10 characters)
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={prevStep}
                  variant="outline"
                  className="flex-1 py-4 rounded-xl border-2"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </Button>
                <Button
                  onClick={nextStep}
                  className="flex-1 yellow-button py-4 font-bold rounded-xl"
                  disabled={!isStep2Valid}
                >
                  Next Step
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Social Links */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-black mb-2">
                  Social Links
                </h3>
                <p className="text-gray-600">
                  Connect your community (optional)
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-black flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </Label>
                  <Input
                    placeholder="https://twitter.com/yourtoken"
                    className="yellow-border rounded-xl py-3 text-base"
                    value={formData.twitter}
                    onChange={(e) =>
                      setFormData({ ...formData, twitter: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-black flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Telegram
                  </Label>
                  <Input
                    placeholder="https://t.me/yourtoken"
                    className="yellow-border rounded-xl py-3 text-base"
                    value={formData.telegram}
                    onChange={(e) =>
                      setFormData({ ...formData, telegram: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-black flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Website
                  </Label>
                  <Input
                    placeholder="https://yourtoken.com"
                    className="yellow-border rounded-xl py-3 text-base"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={prevStep}
                  variant="outline"
                  className="flex-1 py-4 rounded-xl border-2"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </Button>
                <Button
                  onClick={nextStep}
                  className="flex-1 yellow-button py-4 font-bold rounded-xl"
                >
                  Next Step
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Tokenomics */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-black mb-2">
                  Tokenomics
                </h3>
                <p className="text-gray-600">Configure your token economics</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-black">
                    Creator Allocation: {formData.creatorPercentage[0]}%
                  </Label>
                  <Slider
                    value={formData.creatorPercentage}
                    onValueChange={(value) =>
                      setFormData({ ...formData, creatorPercentage: value })
                    }
                    max={20}
                    step={0.2}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>20%</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Percentage of total supply allocated to you as the creator
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="liquidity"
                    className="text-sm font-bold text-black"
                  >
                    Liquidity Pool Amount (USD) *
                  </Label>
                  <Input
                    id="liquidity"
                    type="number"
                    placeholder="1000"
                    className="yellow-border rounded-xl py-3 text-base"
                    value={formData.liquidityAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        liquidityAmount: e.target.value,
                      })
                    }
                    min="100"
                  />
                  <p className="text-xs text-gray-600">
                    Minimum $5 required for initial liquidity
                  </p>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                  <h4 className="font-bold text-black mb-2">Summary</h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Supply:</span>
                      <span className="font-medium">1B ${formData.symbol}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Self Mint:</span>
                      <span className="font-medium">
                        {(
                          (formData.creatorPercentage[0] * 1000000000) /
                          100
                        ).toLocaleString()}{" "}
                        ${formData.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Liquidity:</span>
                      <span className="font-medium">
                        ${formData.liquidityAmount || "0"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-yellow-300 pt-1.5">
                      <span className="text-gray-600">Total Cost:</span>
                      <span className="font-bold text-black">
                        ${Number(formData.liquidityAmount) + 1}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={prevStep}
                  variant="outline"
                  className="flex-1 py-4 rounded-xl border-2"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 yellow-button py-4 font-bold rounded-xl"
                  disabled={!isStep4Valid}
                >
                  Create Coin
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-black mb-2">
                  Coin Created!
                </h3>
                <p className="text-gray-600">
                  Your coin is now live on the blockchain
                </p>
              </div>

              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 text-left">
                <p className="font-bold text-black mb-2">
                  {formData.name} (${formData.symbol})
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Contract: 0x1234...5678
                </p>
                <p className="text-sm text-gray-600">
                  Your allocation: {formData.creatorPercentage[0]}%
                </p>
              </div>

              <div className="space-y-3">
                <Button className="w-full yellow-button py-4 font-bold rounded-xl">
                  View Your Coin
                </Button>
                <Button
                  variant="outline"
                  className="w-full py-4 rounded-xl border-2"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
