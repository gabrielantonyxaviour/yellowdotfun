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
  SheetTrigger,
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
  Plus,
} from "lucide-react";
import { useState } from "react";
import { useNitrolite } from "@/hooks/use-nitrolite";
import { ethers } from "ethers";
import { Address } from "viem";
import { useRouter } from "next/navigation";
import { createToken } from "@/lib/api";

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

export function CreateCoinSheet() {
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { participants, createAppSession, closeAppSession } = useNitrolite();
  const [tokenId, setTokenId] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    name: "Real Meme",
    symbol: "RMEME",
    image: null,
    description: "Real Meme is a meme coin that is real",
    twitter: "https://twitter.com/realmeme",
    telegram: "https://t.me/realmeme",
    website: "https://realmeme.com",
    creatorPercentage: [10],
    liquidityAmount: "0.0001",
  });

  const totalSteps = 4;
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    console.log("Starting token creation process...");
    console.log("Form data:", formData);

    console.log("Initializing Ethereum provider...");
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    console.log("Connected wallet address:", address);

    console.log("Preparing pre-allocation changes...");
    const preAllocationChanges = [
      {
        participant: address as Address,
        asset: "usdc",
        amount: formData.liquidityAmount,
      },
    ];
    console.log("Pre-allocation changes:", preAllocationChanges);

    console.log("Creating app session...");
    await createAppSession(preAllocationChanges);
    console.log("App session created successfully");

    console.log("Preparing post-allocation changes...");
    const postAllocationChanges = [
      {
        participant: address as Address,
        asset: formData.symbol,
        amount: (
          (formData.creatorPercentage[0] * 1_000_000_000) /
          100
        ).toString(),
      },
    ];
    console.log("Post-allocation changes:", postAllocationChanges);

    console.log("Closing app session...");
    await closeAppSession(postAllocationChanges);
    console.log("App session closed successfully");

    let imageUrl = "";
    // if (formData.image) {
    //   const uploadFormData = new FormData();
    //   uploadFormData.append("file", formData.image);
    //   console.log("Uploading image to Pinata...");
    //   const imageRequst = await fetch("/api/supabase/image", {
    //     method: "POST",
    //     body: uploadFormData,
    //   });
    //   const imageResponse = await imageRequst.json();
    //   imageUrl = imageResponse.url;
    //   console.log("Image uploaded successfully:", imageUrl);
    // }

    interface CreateTokenRequest {
      token_name: string;
      token_symbol: string;
      token_image?: string;
      creator_allocation?: number;
      liquidity_amount: number;
      twitter?: string;
      telegram?: string;
      website?: string;
    }

    try {
      console.log("Preparing token data...");
      const tokenData = {
        token_name: formData.name,
        token_symbol: formData.symbol,
        token_image: imageUrl,
        creator_allocation: formData.creatorPercentage[0],
        liquidity_amount: parseFloat(formData.liquidityAmount),
        twitter: formData.twitter,
        telegram: formData.telegram,
        website: formData.website,
        creator_address: address,
      };

      console.log("Creating token...");
      const token = await createToken(tokenData);

      console.log("Token created successfully:", token);
      setTokenId(token.id);
      setStep(5);
    } catch (error: any) {
      console.error("Token creation failed:", error);
      alert("Failed to create token: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isStep1Valid = formData.name && formData.symbol && formData.image;
  const isStep2Valid = formData.description.length >= 10;
  const isStep4Valid =
    formData.liquidityAmount && parseFloat(formData.liquidityAmount) > 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button className="bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 rounded-xl p-3">
          <Plus className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[90vh] rounded-t-3xl border-t-2 border-stone-700 bg-stone-900 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom data-[state=open]:duration-300 data-[state=closed]:duration-200"
      >
        <SheetHeader className="pb-6">
          <SheetTitle className="text-2xl font-black text-white text-start mb-4">
            {step === 5 ? "Success!" : "Create Your Coin"}
          </SheetTitle>

          {/* Progress Bar */}
          {step <= totalSteps && (
            <div className="flex gap-1 mt-4">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full ${
                    i + 1 <= step ? "bg-yellow-400" : "bg-stone-700"
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
                <h3 className="text-xl font-bold text-white mb-2">
                  Basic Information
                </h3>
                <p className="text-stone-400">Let's start with the basics</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-white">
                  Coin Image *
                </Label>
                <div className="flex justify-center">
                  <div className="relative">
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center w-32 h-32 border-4 border-dashed border-stone-600 rounded-full cursor-pointer bg-stone-800 hover:bg-stone-700 transition-colors overflow-hidden"
                    >
                      {formData.image ? (
                        <img
                          src={URL.createObjectURL(formData.image)}
                          alt="Coin preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <Upload className="w-8 h-8 mb-1 text-stone-400" />
                          <p className="text-xs text-stone-400 font-medium text-center px-2">
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
                <Label htmlFor="name" className="text-sm font-bold text-white">
                  Coin Name *
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Yellow Doge"
                  className="rounded-xl py-3 text-base bg-stone-800 border-stone-600 text-white placeholder:text-stone-400"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  autoFocus={false}
                />
              </div>

              {/* Symbol */}
              <div className="space-y-2">
                <Label
                  htmlFor="symbol"
                  className="text-sm font-bold text-white"
                >
                  Symbol *
                </Label>
                <Input
                  id="symbol"
                  placeholder="e.g. YDOGE"
                  className=" rounded-xl py-3 text-base uppercase bg-stone-800 border-stone-600 text-white placeholder:text-stone-400"
                  value={formData.symbol}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      symbol: e.target.value.toUpperCase(),
                    })
                  }
                  maxLength={10}
                  autoFocus={false}
                />
                <p className="text-xs text-stone-400">Max 10 characters</p>
              </div>

              <Button
                onClick={nextStep}
                className="w-full yellow-button py-4 text-lg font-semibold text-sm rounded-xl"
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
                <h3 className="text-xl font-bold text-white mb-2">
                  About Your Coin
                </h3>
                <p className="text-stone-400">Tell the world about your coin</p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-bold text-white"
                >
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your coin, its purpose, and what makes it special..."
                  className="rounded-xl text-base resize-none h-32 bg-stone-800 border-stone-600 text-white placeholder:text-stone-400"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  maxLength={500}
                />
                <p className="text-xs text-stone-400 text-right">
                  {formData.description.length}/500 (minimum 10 characters)
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={prevStep}
                  variant="outline"
                  className="flex-1 py-4 rounded-xl border-2 border-stone-600 bg-stone-800 text-white hover:bg-stone-700"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </Button>
                <Button
                  onClick={nextStep}
                  className="flex-1 yellow-button py-4 font-semibold text-sm rounded-xl"
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
                <h3 className="text-xl font-bold text-white mb-2">
                  Social Links
                </h3>
                <p className="text-stone-400">
                  Connect your community (optional)
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-white flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </Label>
                  <Input
                    placeholder="https://twitter.com/yourtoken"
                    className=" rounded-xl py-3 text-base bg-stone-800 border-stone-600 text-white placeholder:text-stone-400"
                    value={formData.twitter}
                    onChange={(e) =>
                      setFormData({ ...formData, twitter: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Telegram
                  </Label>
                  <Input
                    placeholder="https://t.me/yourtoken"
                    className=" rounded-xl py-3 text-base bg-stone-800 border-stone-600 text-white placeholder:text-stone-400"
                    value={formData.telegram}
                    onChange={(e) =>
                      setFormData({ ...formData, telegram: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-white flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Website
                  </Label>
                  <Input
                    placeholder="https://yourtoken.com"
                    className=" rounded-xl py-3 text-base bg-stone-800 border-stone-600 text-white placeholder:text-stone-400"
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
                  className="flex-1 py-4 rounded-xl border-2 border-stone-600 bg-stone-800 text-white hover:bg-stone-700"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </Button>
                <Button
                  onClick={nextStep}
                  className="flex-1 yellow-button py-4 font-semibold text-sm rounded-xl"
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
                <h3 className="text-xl font-bold text-white mb-2">
                  Tokenomics
                </h3>
                <p className="text-stone-400">Configure your token economics</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-white">
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
                  <div className="flex justify-between text-xs text-stone-400">
                    <span>0%</span>
                    <span>20%</span>
                  </div>
                  <p className="text-xs text-stone-400">
                    Percentage of total supply allocated to you as the creator
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="liquidity"
                    className="text-sm font-bold text-white"
                  >
                    Liquidity Pool Amount (USD) *
                  </Label>
                  <Input
                    id="liquidity"
                    type="number"
                    placeholder="1000"
                    className=" rounded-xl py-3 text-base bg-stone-800 text-white placeholder:text-stone-400"
                    value={formData.liquidityAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        liquidityAmount: e.target.value,
                      })
                    }
                    min="100"
                  />
                </div>

                <div className="bg-stone-800 border-2 border-stone-600 rounded-xl p-4">
                  <h4 className="font-bold text-white mb-2">Summary</h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-400">Total Supply:</span>
                      <span className="font-medium text-white">
                        1B ${formData.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-400">Self Mint:</span>
                      <span className="font-medium text-white">
                        {(
                          (formData.creatorPercentage[0] * 1000000000) /
                          100
                        ).toLocaleString()}{" "}
                        ${formData.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-400">Liquidity:</span>
                      <span className="font-medium text-white">
                        ${formData.liquidityAmount || "0"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-stone-600 pt-1.5">
                      <span className="text-stone-400">Total Cost:</span>
                      <span className="font-bold text-white">
                        ${Number(formData.liquidityAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={prevStep}
                  variant="outline"
                  className="flex-1 py-4 rounded-xl border-2 border-stone-600 bg-stone-800 text-white hover:bg-stone-700"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 yellow-button py-4 font-bold rounded-xl"
                  disabled={!isStep4Valid || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Creating...
                    </div>
                  ) : (
                    "Create Coin"
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-green-400" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Coin Created!
                </h3>
                <p className="text-stone-400">
                  Your coin is now live on the blockchain
                </p>
              </div>

              <div className="bg-stone-800 border-2 border-stone-600 rounded-xl p-4 text-left">
                <p className="font-bold text-white mb-2">
                  {formData.name} (${formData.symbol})
                </p>

                <p className="text-sm text-stone-400">
                  Your allocation:{" "}
                  {(
                    (formData.creatorPercentage[0] * 1_000_000_000) /
                    100
                  ).toLocaleString()}{" "}
                  ${formData.symbol}
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full yellow-button py-4 font-bold rounded-xl"
                  onClick={() => {
                    router.push(`/token/${tokenId}`);
                  }}
                >
                  View Your Coin
                </Button>
                <Button
                  variant="outline"
                  className="w-full py-4 rounded-xl border-2 border-stone-600 bg-stone-800 text-white hover:bg-stone-700"
                  onClick={() => setOpen(false)}
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
