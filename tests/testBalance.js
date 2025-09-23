import { ethers } from "ethers";
import config from "../config.js"; // đảm bảo đường dẫn đúng

const provider = new ethers.JsonRpcProvider(config.alchemy.rpcHttp);
const wallet = new ethers.Wallet(config.testPrivateKey, provider);

async function checkBalance() {
  // ethers v6: wallet.getBalance() không còn
  const balance = await provider.getBalance(wallet.address);
  console.log("ETH balance:", ethers.formatEther(balance));
}
async function checkNetwork() {
  const network = await provider.getNetwork();
  console.log("Connected network:", network);
}

checkNetwork();

checkBalance();
