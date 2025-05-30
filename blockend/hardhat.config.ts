import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import { config as dotEnvConfig } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

dotEnvConfig();

const FLOW_TESTNET_RPC_URL = process.env.FLOW_TESTNET_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0";

const config: HardhatUserConfig = {
  networks: {
    flowTestnet: {
      accounts: [PRIVATE_KEY],
      url: FLOW_TESTNET_RPC_URL,
      chainId: 545,
    },
  },
  etherscan: {
    apiKey: {
      flowTestnet: "N/A",
    },
    customChains: [
      {
        chainId: 545,
        network: "flowTestnet",
        urls: {
          apiURL: "https://evm-testnet.flowscan.io/api",
          browserURL: "https://evm-testnet.flowscan.io",
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000, // or higher, e.g. 10000 for tests
      },
    },
  },
};

export default config;
