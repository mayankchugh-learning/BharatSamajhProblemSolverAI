import type { Express, Request, Response, RequestHandler } from "express";
import rateLimit from "express-rate-limit";
import { openai } from "./client";

const imageRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: "Image generation limit reached. Try again in an hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

export function registerImageRoutes(app: Express, auth: RequestHandler): void {
  app.post("/api/generate-image", auth, imageRateLimit, async (req: Request, res: Response) => {
    try {
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
      console.error("Error generating image:", error);
      res.status(500).json({ error: "Failed to generate image" });
    }
  });
}
