// src/app.js
import express from "express";
import cors from "cors";
import config from "../config.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import proposalRoutes from "./routes/proposalRoutes.js";

const app = express();

app.use(
  cors({
    origin: config.frontendUrl,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/proposals", proposalRoutes);

app.use(errorHandler);

export default app;
