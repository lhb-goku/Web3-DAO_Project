import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import config from "../config.js";
import { initBlockchainService } from "../src/services/blockchain/blockchainService.js";

// ------------------ Mock IO ------------------
const mockIo = {
  emit: (event, data) => {
    console.log(" [Mock IO Emit]", event, data);
  },
};

// ------------------ Load ABI ------------------
const abiPath = path.resolve("./src/services/blockchain/fundraisingABI.json");
const abi = JSON.parse(fs.readFileSync(abiPath, "utf8"));

// ------------------ Provider + Wallet ------------------
const provider = new ethers.JsonRpcProvider(config.alchemy.rpcHttp); // Dùng HTTP để gửi tx
const wallet = new ethers.Wallet(config.testPrivateKey, provider); // Private key test account

// ------------------ Contract ------------------
const contractAddress = config.contracts.usdt;
const contract = new ethers.Contract(contractAddress, abi, wallet);

// ------------------ Start service ------------------
initBlockchainService(mockIo);

console.log("Blockchain service test started. Listening to events...");

// ------------------ Helper để trigger event ------------------
async function triggerTestEvents() {
  console.log("Triggering minimal test events...");

  // 1️⃣ Donate
  const donateAmount = ethers.parseUnits("1", 18); // 1 token giả lập
  try {
    const tx1 = await contract.donate(donateAmount);
    await tx1.wait();
    console.log("Donate transaction mined");
  } catch (err) {
    console.error("Donate failed:", err.reason || err);
  }
}

// ------------------ Run test ------------------
triggerTestEvents();
