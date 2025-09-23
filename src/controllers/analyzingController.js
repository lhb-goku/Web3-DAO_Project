import { analyzeFundraisingProposal } from "../services/geminiService.js";

export async function analyzeProposal(req, res, next) {
  try {
    const { text, imageBase64 } = req.body;

    // gọi service Gemini
    const result = await analyzeFundraisingProposal(text, imageBase64);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err); // đẩy xuống error middleware
  }
}
