import {
  NitroliteClient,
  createAuthRequestMessage,
  createAuthVerifyMessage,
  createGetLedgerBalancesMessage,
  type NitroliteClientConfig,
  waitForTransaction,
} from "@erc7824/nitrolite";
import { NITROLITE_CONFIG } from "./config";
import { createEthersSigner, generateKeyPair } from "./crypto";
import type { Hex } from "viem";

export interface ChannelData {
  channelId: string;
  state?: any;
}

class NitroliteService {
  public client!: NitroliteClient;
  private wsConnection: WebSocket | null = null;
  private isConnected = false;
  private activeChannel: ChannelData | null = null;

  constructor() {
    this.restoreChannelFromStorage();
  }

  private isLocalStorageAvailable(): boolean {
    return typeof localStorage !== "undefined";
  }

  private restoreChannelFromStorage(): void {
    if (!this.isLocalStorageAvailable()) return;

    try {
      const channelId = localStorage.getItem("nitro_channel_id");
      const channelState = localStorage.getItem("nitro_channel_state");

      if (channelId && channelState) {
        this.activeChannel = {
          channelId,
          state: JSON.parse(channelState, (_, value) => {
            if (typeof value === "string" && value.endsWith("n")) {
              return BigInt(value.slice(0, -1));
            }
            return value;
          }),
        };
      }
    } catch (error) {
      console.error("Failed to restore channel:", error);
      this.clearChannelStorage();
    }
  }

  private clearChannelStorage() {
    if (!this.isLocalStorageAvailable()) return;
    localStorage.removeItem("nitro_channel_id");
    localStorage.removeItem("nitro_channel_state");
  }

  async initialize(config: NitroliteClientConfig): Promise<boolean> {
    try {
      this.client = new NitroliteClient(config);
      await this.initializeWebSocket();
      this.isConnected = true;
      return true;
    } catch (error) {
      console.error("Failed to initialize:", error);
      throw error;
    }
  }

  private async initializeWebSocket(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        this.wsConnection = new WebSocket(NITROLITE_CONFIG.BROKER_WS_URL);

        this.wsConnection.onopen = async () => {
          try {
            await this.authenticateWithBroker();
            resolve();
          } catch (error) {
            reject(error);
          }
        };

        this.wsConnection.onerror = reject;
        this.wsConnection.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleWebSocketMessage(message);
          } catch (error) {
            console.error("Error parsing message:", error);
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private async authenticateWithBroker(): Promise<void> {
    let keyPair = null;
    const savedKeys = this.isLocalStorageAvailable()
      ? localStorage.getItem("crypto_keypair")
      : null;

    if (savedKeys) {
      try {
        keyPair = JSON.parse(savedKeys);
      } catch {
        keyPair = null;
      }
    }

    if (!keyPair) {
      keyPair = await generateKeyPair();
      if (this.isLocalStorageAvailable()) {
        localStorage.setItem("crypto_keypair", JSON.stringify(keyPair));
      }
    }

    const signer = createEthersSigner(keyPair.privateKey);

    return new Promise((resolve, reject) => {
      const authMessageHandler = async (event: MessageEvent) => {
        try {
          const message = JSON.parse(event.data);

          if (message.res && message.res[1] === "auth_challenge") {
            const authVerify = await createAuthVerifyMessage(
              signer.sign,
              event.data,
              signer.address
            );
            this.wsConnection?.send(authVerify);
          } else if (message.res && message.res[1] === "auth_verify") {
            this.wsConnection?.removeEventListener(
              "message",
              authMessageHandler
            );
            resolve();
          }
        } catch (error) {
          reject(error);
        }
      };

      this.wsConnection?.addEventListener("message", authMessageHandler);

      createAuthRequestMessage(signer.sign, signer.address)
        .then((authRequest) => {
          this.wsConnection?.send(authRequest);
        })
        .catch(reject);
    });
  }

  private handleWebSocketMessage(message: any): void {
    // Handle incoming messages
    console.log("Received message:", message);
  }

  async createChannel(depositAmount: bigint): Promise<ChannelData> {
    try {
      console.log("Starting deposit...");
      const depositResponse = await this.client.deposit(depositAmount);
      await waitForTransaction(this.client.publicClient, depositResponse);

      console.log("Creating channel...");
      const createChannelResponse = await this.client.createChannel({
        initialAllocationAmounts: [depositAmount, BigInt(0)],
        stateData: "0x",
      });

      if (createChannelResponse?.channelId) {
        const channelData = { channelId: createChannelResponse.channelId };
        if (this.isLocalStorageAvailable()) {
          localStorage.setItem(
            "nitro_channel_id",
            createChannelResponse.channelId
          );
        }
        this.activeChannel = channelData;
        return channelData;
      }

      throw new Error("Failed to create channel");
    } catch (error) {
      console.error("Error creating channel:", error);
      throw error;
    }
  }

  async getAccountChannels() {
    return await this.client.getAccountChannels();
  }

  getActiveChannel(): ChannelData | null {
    return this.activeChannel;
  }
}

export const nitroliteService = new NitroliteService();
