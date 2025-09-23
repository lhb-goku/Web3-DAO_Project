import express from "express";
import { analyzeProposal } from "../controllers/analyzingController.js";
import { validateFundraisingInput } from "../middlewares/validateFundraisingInput.js";

const router = express.Router();

router.post("/analyze", validateFundraisingInput, analyzeProposal);

export default router;
