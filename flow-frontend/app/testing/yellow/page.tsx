// app/testing/yellow/page.tsx
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WebSocketConnection from "@/components/testing/yellow/web-socket-connection";
import AuthenticationPanel from "@/components/testing/yellow/authentication-panel";
import ParticipantsList from "@/components/testing/yellow/participants-list";
import SessionManager from "@/components/testing/yellow/session-manager";
import AllocationManager from "@/components/testing/yellow/allocation-manager";
import { useNitrolite } from "@/hooks/use-nitrolite";

export default function YellowTestingPage() {
  const {
    ws,
    connectionStatus,
    isAuthenticated,
    participants,
    currentSession,
    allocations,
    error,
    connectToWebSocket,
    authenticateUser,
    createAppSession,
    closeAppSession,
    updateAllocation,
    removeAllocation,
  } = useNitrolite();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Nitrolite Testing Interface</h1>
        <p className="text-muted-foreground">
          Test all Nitrolite features on Worldchain Mainnet
        </p>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="connection" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="connection">Connection</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="session">Session</TabsTrigger>
          <TabsTrigger value="allocations">Allocations</TabsTrigger>
        </TabsList>

        <TabsContent value="connection">
          <WebSocketConnection
            ws={ws}
            connectionStatus={connectionStatus}
            onConnect={connectToWebSocket}
          />
        </TabsContent>

        <TabsContent value="auth">
          <AuthenticationPanel
            ws={ws}
            isAuthenticated={isAuthenticated}
            connectionStatus={connectionStatus}
            onAuthenticate={authenticateUser}
          />
        </TabsContent>

        <TabsContent value="participants">
          <ParticipantsList participants={participants} />
        </TabsContent>

        <TabsContent value="session">
          <SessionManager
            currentSession={currentSession}
            participants={participants}
            onCreateSession={createAppSession}
            onCloseSession={closeAppSession}
          />
        </TabsContent>

        <TabsContent value="allocations">
          <AllocationManager
            allocations={allocations}
            participants={participants}
            onUpdateAllocation={updateAllocation}
            onRemoveAllocation={removeAllocation}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
