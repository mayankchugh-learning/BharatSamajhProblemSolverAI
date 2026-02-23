import type { Express, Request, Response, RequestHandler } from "express";
import rateLimit from "express-rate-limit";
import { openai } from "./client";
import { logger } from "../../utils/logger";

const imageRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: "Image generation limit reached. Try again in an hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

export function registerImageRoutes(app: Express, auth: RequestHandler): void {
  app.post("/api/v1/generate-image", auth, imageRateLimit, async (req: Request, res: Response) => {
    try {
      if (!openai) {
        return res.status(503).json({
          error: "AI image generation is not configured. Set OPENAI_API_KEY or AI_INTEGRATIONS_OPENAI_API_KEY in .env",
        });
      }

      const { prompt, size = "1024x1024" } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const response = await openai.images.generate({
        model: "gpt-image-1",
        prompt,
        n: 1,
        size: size as "1024x1024" | "512x512" | "256x256",
      });

      const imageData = response.data?.[0];
      res.json({
        url: imageData?.url ?? null,
        b64_json: imageData?.b64_json ?? null,
      });
    } catch (error) {
      req.log?.error({ err: error }, "Error generating image") ?? logger.error({ err: error }, "Error generating image");
      res.status(500).json({ error: "Failed to generate image" });
    }
  });
}
