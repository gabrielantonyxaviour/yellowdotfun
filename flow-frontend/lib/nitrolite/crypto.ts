import { ethers } from "ethers";
import type { Hex } from "viem";

export interface CryptoKeypair {
  publicKey: string;
  privateKey: string;
  address?: Hex;
}

export interface WalletSigner {
  publicKey: string;
  address: Hex;
  sign: (payload: any) => Promise<Hex>;
}

export const createEthersSigner = (privateKey: string): WalletSigner => {
  const wallet = new ethers.Wallet(privateKey);

  return {
    publicKey: wallet.publicKey,
    address: wallet.address as Hex,
    sign: async (payload: any): Promise<Hex> => {
      const payloadStr =
        typeof payload === "string" ? payload : JSON.stringify(payload);
      const messageBytes = ethers.utils.arrayify(ethers.utils.id(payloadStr));
      const flatSignature = await wallet._signingKey().signDigest(messageBytes);
      return ethers.utils.joinSignature(flatSignature) as Hex;
    },
  };
};

export const generateKeyPair = async (): Promise<CryptoKeypair> => {
  const wallet = ethers.Wallet.createRandom();
  const privateKeyHash = ethers.utils.keccak256(wallet.privateKey);
  const walletFromHashedKey = new ethers.Wallet(privateKeyHash);

  return {
    privateKey: privateKeyHash,
    publicKey: walletFromHashedKey.publicKey,
    address: walletFromHashedKey.address as Hex,
  };
};
