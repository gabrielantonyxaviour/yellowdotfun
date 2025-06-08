// app/testing/yellow/components/AllocationManager.tsx
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";

interface Allocation {
  participant: string;
  asset: string;
  amount: string;
}

interface Participant {
  address: string;
  joinedAt: number;
}

interface Props {
  allocations: Allocation[];
  participants: Participant[];
  onUpdateAllocation: (
    participant: string,
    asset: string,
    amount: string
  ) => void;
  onRemoveAllocation: (participant: string, asset: string) => void;
}

export default function AllocationManager({
  allocations,
  participants,
  onUpdateAllocation,
  onRemoveAllocation,
}: Props) {
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [asset, setAsset] = useState("");
  const [amount, setAmount] = useState("");

  const handleAddAllocation = () => {
    if (!selectedParticipant || !asset || !amount) return;

    onUpdateAllocation(selectedParticipant, asset.toLowerCase(), amount);
    setAsset("");
    setAmount("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Allocation Manager</CardTitle>
        <CardDescription>
          Add/remove token allocations for participants
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Allocation */}
        <div className="space-y-4 p-4 border rounded">
          <h4 className="font-medium">Add Allocation</h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="participant">Participant</Label>
              <Select
                value={selectedParticipant}
                onValueChange={setSelectedParticipant}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select participant" />
                </SelectTrigger>
                <SelectContent>
                  {participants.map((p) => (
                    <SelectItem key={p.address} value={p.address}>
                      {p.address.slice(0, 6)}...{p.address.slice(-4)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset">Asset Symbol</Label>
              <Input
                id="asset"
                placeholder="e.g. usdc, eth, dai"
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              placeholder="e.g. 1000000 (for 1 USDC with 6 decimals)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <Button onClick={handleAddAllocation} className="w-full">
            Add/Update Allocation
          </Button>
        </div>

        {/* Current Allocations */}
        <div className="space-y-4">
          <h4 className="font-medium">
            Current Allocations ({allocations.length})
          </h4>

          {allocations.length === 0 ? (
            <p className="text-muted-foreground text-sm">No allocations yet</p>
          ) : (
            <div className="space-y-2">
              {allocations.map((allocation, index) => (
                <div
                  key={`${allocation.participant}-${allocation.asset}`}
                  className="flex items-center justify-between p-3 border rounded"
                >
                  <div className="flex-1">
                    <p className="font-mono text-sm">
                      {allocation.participant.slice(0, 6)}...
                      {allocation.participant.slice(-4)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {allocation.amount} {allocation.asset.toUpperCase()}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      onRemoveAllocation(
                        allocation.participant,
                        allocation.asset
                      )
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
