// app/testing/yellow/components/AuthenticationPanel.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  ws: WebSocket | null;
  isAuthenticated: boolean;
  connectionStatus: string;
  onAuthenticate: () => void;
}

export default function AuthenticationPanel({
  ws,
  isAuthenticated,
  connectionStatus,
  onAuthenticate,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Authentication
          <Badge variant={isAuthenticated ? "default" : "secondary"}>
            {isAuthenticated ? "Authenticated" : "Not Authenticated"}
          </Badge>
        </CardTitle>
        <CardDescription>
          Authenticate with ClearNode using your wallet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground space-y-1">
          <p>1. Connect wallet to get address</p>
          <p>2. Send auth_request to ClearNode</p>
          <p>3. Sign challenge and send auth_verify</p>
          <p>4. Receive auth_success and store participant</p>
        </div>

        <Button
          onClick={onAuthenticate}
          disabled={connectionStatus !== "connected" || isAuthenticated}
          className="w-full"
        >
          {isAuthenticated
            ? "Already Authenticated"
            : "Authenticate with Wallet"}
        </Button>
      </CardContent>
    </Card>
  );
}
