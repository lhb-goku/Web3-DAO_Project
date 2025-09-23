// config.js
import dotenv from "dotenv";

dotenv.config();

const config = {
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
    env: process.env.NODE_ENV || "development",
    frontendUrl: process.env.FRONTEND_URL || "*", // cho CORS
  },
  alchemy: {
    apiKey: process.env.ALCHEMY_API_KEY,
    rpcHttp: process.env.RPC_HTTP,
    rpcWs: process.env.RPC_WS,
  },
  gemini: {
    url: process.env.GEMINI_API_URL,
    apiKey: process.env.GEMINI_API_KEY,
  },
  contracts: {
    usdt: process.env.USDT_ADDRESSES, // hỗ trợ nhiều contract address
  },
  testPrivateKey: process.env.TEST_PRIVATE_KEY, // private key dùng để test (nên là account testnet)
};

export default config;
