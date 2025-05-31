// app/testing/yellow/components/SessionManager.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AppSession {
  id: string;
  status: string;
  participants: string[];
  createdAt: number;
}

interface Participant {
  address: string;
  joinedAt: number;
}

interface Props {
  currentSession: AppSession | null;
  participants: Participant[];
  onCreateSession: () => void;
  onCloseSession: () => void;
}

export default function SessionManager({
  currentSession,
  participants,
  onCreateSession,
  onCloseSession,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <p>Application Session</p>
        </CardTitle>
        <CardDescription>
          Manage application sessions for testing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentSession ? (
          <div className="space-y-3">
            <div className="p-3 border rounded bg-muted/50">
              <p className="font-mono text-sm">{currentSession.id}</p>
              <p className="text-xs text-muted-foreground">
                Created: {new Date(currentSession.createdAt).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                Participants: {currentSession.participants.length}
              </p>
            </div>

            <Button
              onClick={onCloseSession}
              variant="destructive"
              className="w-full"
            >
              Close Session
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              No active session. Need at least 2 participants to create one.
            </p>

            <Button
              onClick={onCreateSession}
              disabled={participants.length < 2}
              className="w-full"
            >
              Create New Session
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
