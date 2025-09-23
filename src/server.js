import http from "http";
import config from "../config.js";
import logger from "./utils/logger.js";

import app from "./app.js";
import { initSocket } from "./socket.js";
import { initBlockchainService } from "./services/blockchain/blockchainService.js";

const server = http.createServer(app);

const io = initSocket(server);

initBlockchainService(io);

server.listen(config.server.port, () => {
  logger.info(`Server running on port ${config.server.port}`);
});
