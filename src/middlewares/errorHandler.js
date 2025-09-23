import logger from "../utils/logger.js";

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  logger.error(" Error:", err.message);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || "Internal Server Error",
    details: err.details || null,
  });
}
