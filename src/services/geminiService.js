import axios from "axios";
import config from "../../config.js";
import { FUNDRAISING_PROMPT } from "../prompts/fundraisingPrompt.js";

export async function analyzeFundraisingProposal(text, imageBase64) {
  try {
    const body = {
      contents: [
        {
          role: "user",
          parts: [
            { text: FUNDRAISING_PROMPT },
            { text: `User fundraising proposal: ${text}` },
            ...(imageBase64
              ? [
                  {
                    inline_data: {
                      mime_type: "image/png",
                      data: imageBase64,
                    },
                  },
                ]
              : []),
          ],
        },
      ],
    };

    const response = await axios.post(config.gemini.url, body, {
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": config.gemini.apiKey,
      },
      timeout: 15000,
    });

    // Lấy text trả về
    let resultText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!resultText) {
      return {
        allowed: false,
        reason: "Gemini returned empty or unexpected response",
      };
    }
    resultText = resultText.trim();
    if (resultText.startsWith("```json")) {
      resultText = resultText
        .replace(/^```json\s*/, "")
        .replace(/```$/, "")
        .trim();
    }
    let parsed;
    try {
      parsed = JSON.parse(resultText);
    } catch (e) {
      parsed = { allowed: false, reason: resultText };
    }

    return parsed;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Gemini API call failed: " + err.message;
    }
    throw err;
  }
}
