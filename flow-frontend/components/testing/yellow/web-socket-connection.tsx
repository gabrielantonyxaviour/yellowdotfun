// app/testing/yellow/components/WebSocketConnection.tsx
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
  connectionStatus: "disconnected" | "connecting" | "connected";
  onConnect: () => void;
}

export default function WebSocketConnection({
  ws,
  connectionStatus,
  onConnect,
}: Props) {
  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-500";
      case "connecting":
        return "bg-yellow-500";
      default:
        return "bg-red-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          WebSocket Connection
          <Badge className={getStatusColor()}>{connectionStatus}</Badge>
        </CardTitle>
        <CardDescription>
          Connect to ClearNode at wss://clearnet.yellow.com/ws
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">
            Status: <span className="font-mono">{connectionStatus}</span>
          </p>
          {ws && (
            <p className="text-sm text-muted-foreground">
              Ready State: <span className="font-mono">{ws.readyState}</span>
            </p>
          )}
        </div>

        <Button
          onClick={onConnect}
          disabled={connectionStatus === "connecting"}
          className="w-full"
        >
          {connectionStatus === "connecting"
            ? "Connecting..."
            : "Connect to ClearNode"}
        </Button>
      </CardContent>
    </Card>
  );
}
