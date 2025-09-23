import logger from "../../utils/logger.js";

export function emitError(io, context, err) {
  const errorPayload = {
    context,
    message: err.message,
    timestamp: new Date().toISOString(),
  };
  logger.error(` Blockchain error [${context}]: ${err.message}`);
  io.emit("blockchainError", errorPayload);
}
