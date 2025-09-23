// src/services/blockchain/blockchainService.js
import { ethers } from "ethers";
import config from "../../../config.js";
import fs from "fs";
import path from "path";
import logger from "../../utils/logger.js";
import { subscribeEvents } from "./eventSubscriber.js";
import { emitError } from "./errorHandler.js";

let provider;
let contract;
let reconnectAttempts = 0;
const MAX_RETRY = 6;

// ------------------ Load ABI ------------------
const abiPath = path.resolve("./src/services/blockchain/fundraisingABI.json");
let abi = [];
try {
  abi = JSON.parse(fs.readFileSync(abiPath, "utf8"));
  logger.info("ABI loaded successfully");
} catch (err) {
  logger.error("Failed to load ABI: " + err.message);
}

export async function initBlockchainService(io) {
  logger.debug("initBlockchainService() called");
  await connect(io);
}

async function connect(io) {
  try {
    logger.debug("connect() called");

    if (!config.alchemy.rpcWs) throw new Error("Alchemy WebSocket URL missing");

    provider = new ethers.WebSocketProvider(config.alchemy.rpcWs);
    logger.debug("WebSocketProvider created");

    await provider.ready; // Đợi WebSocket sẵn sàng
    reconnectAttempts = 0;
    logger.info("Connected to Alchemy WebSocket");

    const contractAddress = config.contracts.usdt;
    if (!contractAddress) {
      logger.error("Contract address is undefined!");
      return;
    }

    contract = new ethers.Contract(contractAddress, abi, provider);
    if (!contract) {
      logger.error("Failed to create contract instance");
      return;
    }

    subscribeEventsSafe(contract, io);

    // Lắng nghe close / error để reconnect
    provider._websocket?.on("close", (code) => {
      logger.warn(`WebSocket closed: ${code}`);
      emitError(io, "WebSocket", new Error(`Closed with code ${code}`));
      reconnect(io);
    });

    provider._websocket?.on("error", (err) => {
      logger.error("WebSocket error: " + err.message);
      emitError(io, "WebSocket", err);
      reconnect(io);
    });
  } catch (err) {
    logger.error("connect() failed: " + err.message);
    emitError(io, "Init", err);
    reconnect(io);
  }
}

function subscribeEventsSafe(contract, io) {
  if (!contract) {
    logger.error("Cannot subscribe events: contract is undefined");
    return;
  }

  try {
    subscribeEvents(contract, io);
    logger.info("Subscribed to contract events successfully");
  } catch (err) {
    logger.error("Failed to subscribe events: " + err.message);
    emitError(io, "SubscribeEvents", err);
  }
}

function reconnect(io) {
  if (reconnectAttempts >= MAX_RETRY) {
    logger.error("Max reconnect attempts reached. Stopping.");
    return;
  }

  const delay = Math.min(1000 * 2 ** reconnectAttempts, 30000); // max 30s
  logger.info(`Reconnecting in ${delay / 1000}s...`);
  setTimeout(() => connect(io), delay);
  reconnectAttempts++;
}
