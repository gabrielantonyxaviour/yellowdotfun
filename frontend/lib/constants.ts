import { createPublicClient, http } from "viem";
import { flowMainnet } from "viem/chains";

export const publicClient = createPublicClient({
  chain: flowMainnet,
  transport: http(),
});

export const DEFAULT_EXPIRY = Math.floor(Date.now() / 1000) + 3600;

export const CUSTODY_ADDRESS = "0x6258dCa1DF894980a8778197c60893a9fa2b5eF8";
export const ADJUDICATOR_ADDRESS = "0xEd44dba5ECB7928032649EF0075258FA3aca508B";
