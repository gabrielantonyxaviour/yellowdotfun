import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getAuthDomain = () => {
  return {
    name: "yellow.fun",
  };
};

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatNumber(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(7);
}

export function formatPercentage(num: number): string {
  return `${num >= 0 ? "+" : ""}${num.toFixed(2)}%`;
}

export function validateChallenge(data: any): string {
  let challengeUUID: string | null = null;
  if (Array.isArray(data)) {
    console.log(
      "Data is array, extracting challenge from position [2][0].challenge"
    );

    // Direct array access - data[2] should be the array with the challenge object
    if (data.length >= 3 && Array.isArray(data[2]) && data[2].length > 0) {
      const challengeObject = data[2][0];

      if (challengeObject && challengeObject.challenge) {
        challengeUUID = challengeObject.challenge;
        console.log("Extracted challenge UUID from array:", challengeUUID);
      }
    }
  } else if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);

      console.log("Parsed challenge data:", parsed);

      // Handle different message structures
      if (parsed.res && Array.isArray(parsed.res)) {
        // auth_challenge response: {"res": [id, "auth_challenge", {"challenge": "uuid"}, timestamp]}
        if (parsed.res[1] === "auth_challenge" && parsed.res[2]) {
          challengeUUID =
            parsed.res[2].challenge_message || parsed.res[2].challenge;
          console.log(
            "Extracted challenge UUID from auth_challenge:",
            challengeUUID
          );
        }
        // auth_verify message: [timestamp, "auth_verify", [{"address": "0x...", "challenge": "uuid"}], timestamp]
        else if (
          parsed.res[1] === "auth_verify" &&
          Array.isArray(parsed.res[2]) &&
          parsed.res[2][0]
        ) {
          challengeUUID = parsed.res[2][0].challenge;
          console.log(
            "Extracted challenge UUID from auth_verify:",
            challengeUUID
          );
        }
      }
      // Direct array format
      else if (
        Array.isArray(parsed) &&
        parsed.length >= 3 &&
        Array.isArray(parsed[2])
      ) {
        challengeUUID = parsed[2][0]?.challenge;
        console.log(
          "Extracted challenge UUID from direct array:",
          challengeUUID
        );
      }
    } catch (e) {
      console.error("Could not parse challenge data:", e);
      console.log("Using raw string as challenge");
      challengeUUID = data;
    }
  } else if (data && typeof data === "object") {
    // If data is already an object, try to extract challenge
    challengeUUID = data.challenge || data.challenge_message;
    console.log("Extracted challenge from object:", challengeUUID);
  }

  if (
    !challengeUUID ||
    challengeUUID.includes("[") ||
    challengeUUID.includes("{")
  ) {
    console.error(
      "Challenge extraction failed or contains invalid characters:",
      challengeUUID
    );
    throw new Error(
      "Could not extract valid challenge UUID for EIP-712 signing"
    );
  }

  console.log("Final challenge UUID for EIP-712:", challengeUUID);
  console.log("Auth domain:", getAuthDomain());
  return challengeUUID;
}
