"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function TestingWebSocket() {
  const [wsStatus, setWsStatus] = useState<
    "disconnected" | "connecting" | "connected" | "error"
  >("disconnected");
  const [messages, setMessages] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const testConnection = () => {
    setWsStatus("connecting");
    setMessages([]);

    try {
      const websocket = new WebSocket("ws://localhost:8000/ws");

      websocket.onopen = () => {
        setWsStatus("connected");
        addMessage("✅ WebSocket connected successfully");
        setWs(websocket);
      };

      websocket.onmessage = (event) => {
        addMessage(`📨 Received: ${event.data}`);
      };

      websocket.onerror = (error) => {
        setWsStatus("error");
        addMessage(`❌ WebSocket error: ${error}`);
      };

      websocket.onclose = (event) => {
        setWsStatus("disconnected");
        addMessage(`🔌 WebSocket closed: ${event.code} - ${event.reason}`);
        setWs(null);
      };
    } catch (error) {
      setWsStatus("error");
      addMessage(`❌ Failed to create WebSocket: ${error}`);
    }
  };

  const testAuth = async () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      addMessage("❌ WebSocket not connected");
      return;
    }

    try {
      // Test with a simple auth request (you'll need to implement the actual auth)
      const testMessage = {
        req: [
          1,
          "auth_request",
          ["0x1234567890123456789012345678901234567890"],
          Date.now(),
        ],
        sig: "0xtest",
      };

      ws.send(JSON.stringify(testMessage));
      addMessage("📤 Sent test auth request");
    } catch (error) {
      addMessage(`❌ Error sending auth: ${error}`);
    }
  };

  const disconnect = () => {
    if (ws) {
      ws.close();
    }
  };

  const addMessage = (message: string) => {
    setMessages((prev) => [
      `${new Date().toLocaleTimeString()}: ${message}`,
      ...prev.slice(0, 19),
    ]);
  };

  const getStatusColor = () => {
    switch (wsStatus) {
      case "connected":
        return "bg-green-500";
      case "connecting":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            WebSocket Test
            <Badge className={`${getStatusColor()} text-white`}>
              {wsStatus}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={testConnection}
              disabled={wsStatus === "connecting"}
            >
              {wsStatus === "connecting" ? "Connecting..." : "Test Connection"}
            </Button>
            <Button
              onClick={testAuth}
              disabled={wsStatus !== "connected"}
              variant="outline"
            >
              Test Auth
            </Button>
            <Button
              onClick={disconnect}
              disabled={wsStatus === "disconnected"}
              variant="destructive"
            >
              Disconnect
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Messages:</h4>
            <div className="max-h-64 overflow-y-auto space-y-1 p-2 bg-gray-50 rounded">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-sm">No messages yet</p>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className="text-xs font-mono">
                    {message}
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
