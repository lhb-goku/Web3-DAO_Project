import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import config from "../config.js";

// ---------------- LOAD ABI ----------------
const ABI_PATH = path.resolve("./src/services/blockchain/fundraisingABI.json");
let abi = [];
try {
  abi = JSON.parse(fs.readFileSync(ABI_PATH, "utf8"));
} catch (err) {
  console.error("Failed to load ABI:", err.message);
  process.exit(1);
}

// ---------------- PROVIDER & WALLET ----------------
const wsProvider = new ethers.WebSocketProvider(config.alchemy.rpcWs);
const rpcProvider = new ethers.JsonRpcProvider(config.alchemy.rpcHttp);
const wallet = new ethers.Wallet(config.testPrivateKey, rpcProvider);
const daoAddress = config.contracts.usdt; // Thay bằng địa chỉ contract của bạn
const daoContract = new ethers.Contract(daoAddress, abi, wallet);

console.log("Listening for contract events... Keep terminal open.");

// ---------------- SUBSCRIBE EVENTS ----------------
const eventContract = new ethers.Contract(daoAddress, abi, wsProvider);

eventContract.on("DonationReceived", (donor, amount, event) => {
  console.log("[DonationReceived]", {
    donor,
    amount: ethers.formatUnits(amount, 18),
    txHash: event.transactionHash,
  });
});

eventContract.on("ProjectDonation", (projectId, donor, amount, event) => {
  console.log("[ProjectDonation]", {
    projectId: projectId.toString(),
    donor,
    amount: ethers.formatUnits(amount, 18),
    txHash: event.transactionHash,
  });
});

eventContract.on("DaoMemberAdded", (newMember, addedBy, event) => {
  console.log("[DaoMemberAdded]", {
    newMember,
    addedBy,
    txHash: event.transactionHash,
  });
});

// ---------------- TRIGGER EVENT TEST ----------------
async function triggerTestEvents() {
  try {
    console.log("Triggering test events...");

    const amount = ethers.parseUnits("0.01", 18);

    const tx1 = await daoContract.donate(amount);
    await tx1.wait();
    console.log("donate() executed");

    const tx2 = await daoContract.addDaoMember(wallet.address);
    await tx2.wait();
    console.log("addDaoMember() executed");

    const tx3 = await daoContract.donateToProject(1, amount);
    await tx3.wait();
    console.log("donateToProject() executed");
  } catch (err) {
    console.error("Error triggering test events:", err.reason || err);
  }
}

// Chạy trigger sau 5 giây để đảm bảo WebSocket đã subscribe xong
setTimeout(triggerTestEvents, 5000);
