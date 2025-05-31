// app/testing/yellow/components/ParticipantsList.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Participant {
  address: string;
  joinedAt: number;
}

interface Props {
  participants: Participant[];
}

export default function ParticipantsList({ participants }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Participants ({participants.length})</CardTitle>
        <CardDescription>
          All authenticated participants in the session
        </CardDescription>
      </CardHeader>
      <CardContent>
        {participants.length === 0 ? (
          <p className="text-muted-foreground">No participants yet</p>
        ) : (
          <div className="space-y-2">
            {participants.map((participant, index) => (
              <div
                key={participant.address}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div>
                  <p className="font-mono text-sm">{participant.address}</p>
                  <p className="text-xs text-muted-foreground">
                    Joined: {new Date(participant.joinedAt).toLocaleString()}
                  </p>
                </div>
                <Badge variant={index === 0 ? "default" : "secondary"}>
                  {index === 0 ? "Host" : "Participant"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
