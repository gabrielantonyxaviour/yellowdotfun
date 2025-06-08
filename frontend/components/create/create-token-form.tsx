"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function CreateTokenForm() {
  const [step, setStep] = useState(1)
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [initialSupply, setInitialSupply] = useState("")
  const [taxPercentage, setTaxPercentage] = useState([0])
  const [selectedChain, setSelectedChain] = useState("")

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Submit logic would go here
    setStep(4) // Success step
  }

  return (
    <Card className="yellow-border yellow-shadow">
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-1/3 h-2 ${i <= step ? "bg-yellow-400" : "bg-gray-200"} ${i !== 3 ? "mr-1" : ""}`}
              />
            ))}
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span>Token Details</span>
            <span>Tokenomics</span>
            <span>Review</span>
          </div>
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Token Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Token Name</label>
                <Input
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  placeholder="e.g. Yellow Doge"
                  className="yellow-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Token Symbol</label>
                <Input
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value)}
                  placeholder="e.g. YDOGE"
                  className="yellow-border"
                  maxLength={8}
                />
                <p className="text-xs text-gray-500 mt-1">Max 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea placeholder="Describe your token..." className="yellow-border" rows={4} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Blockchain</label>
                <Select value={selectedChain} onValueChange={setSelectedChain}>
                  <SelectTrigger className="yellow-border">
                    <SelectValue placeholder="Select blockchain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="polygon">Polygon</SelectItem>
                    <SelectItem value="bsc">BSC</SelectItem>
                    <SelectItem value="avalanche">Avalanche</SelectItem>
                    <SelectItem value="base">Base</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button onClick={nextStep} className="yellow-button">
                Next Step
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Tokenomics</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Initial Supply</label>
                <Input
                  type="number"
                  value={initialSupply}
                  onChange={(e) => setInitialSupply(e.target.value)}
                  placeholder="e.g. 1000000000"
                  className="yellow-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tax Percentage: {taxPercentage[0]}%</label>
                <Slider
                  value={taxPercentage}
                  onValueChange={setTaxPercentage}
                  max={10}
                  step={0.5}
                  className="yellow-border"
                />
                <p className="text-xs text-gray-500 mt-1">This percentage will be taken from each transaction</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Liquidity Pool</label>
                <Select defaultValue="usd">
                  <SelectTrigger className="yellow-border">
                    <SelectValue placeholder="Select pair" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD</SelectItem>
                    <SelectItem value="eth">ETH</SelectItem>
                    <SelectItem value="matic">MATIC</SelectItem>
                    <SelectItem value="bnb">BNB</SelectItem>
                    <SelectItem value="avax">AVAX</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Alert className="yellow-border bg-yellow-100">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  You'll need to provide liquidity after token creation. Make sure you have funds available.
                </AlertDescription>
              </Alert>
            </div>

            <div className="mt-8 flex justify-between">
              <Button onClick={prevStep} variant="outline" className="yellow-border">
                Previous Step
              </Button>
              <Button onClick={nextStep} className="yellow-button">
                Next Step
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Review Your Token</h2>

            <div className="space-y-4 bg-gray-50 p-4 yellow-border rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Token Name</p>
                  <p className="font-bold">{tokenName || "Yellow Doge"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Token Symbol</p>
                  <p className="font-bold">{tokenSymbol || "YDOGE"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Blockchain</p>
                  <p className="font-bold">{selectedChain || "Ethereum"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Initial Supply</p>
                  <p className="font-bold">{initialSupply || "1,000,000,000"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Tax Percentage</p>
                  <p className="font-bold">{taxPercentage[0]}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Estimated Gas Fee</p>
                  <p className="font-bold">~$50-100</p>
                </div>
              </div>
            </div>

            <Alert className="mt-4 yellow-border bg-yellow-100">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Confirmation</AlertTitle>
              <AlertDescription>
                Once created, token parameters cannot be changed. Please review carefully.
              </AlertDescription>
            </Alert>

            <div className="mt-8 flex justify-between">
              <Button onClick={prevStep} variant="outline" className="yellow-border">
                Previous Step
              </Button>
              <Button onClick={handleSubmit} className="yellow-button">
                Create Token
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Token Created Successfully!</h2>
            <p className="text-gray-600 mb-6">Your token is now being deployed to the blockchain.</p>

            <div className="bg-gray-50 p-4 yellow-border rounded-lg mb-6 text-left">
              <p className="font-medium mb-2">Token Contract Address:</p>
              <p className="font-mono bg-gray-100 p-2 rounded">0x1234...5678</p>
            </div>

            <div className="flex flex-col gap-4">
              <Button className="yellow-button">Add Liquidity</Button>
              <Button variant="outline" className="yellow-border">
                View on Explorer
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
