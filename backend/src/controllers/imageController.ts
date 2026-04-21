import { Request, Response } from "express";
import { HuggingFaceService } from "../services/huggingfaceService";

export class ImageController {
  /**
   * Handles the POST request to generate an image
   * @route POST /generate-image
   */
  public static async generateImage(req: Request, res: Response): Promise<void> {
    try {
      const { prompt } = req.body;

      if (!prompt) {
        res.status(400).json({ error: "Prompt is required" });
        return;
      }

      // Generate the image using Hugging Face Service
      const imageBase64 = await HuggingFaceService.generateImage(prompt);
      
      // Construct the data URL for immediate rendering
      const imageUrl = `data:image/png;base64,${imageBase64}`;

      // Return the required JSON response
      res.status(200).json({
        imageBase64,
        imageUrl,
      });
    } catch (error: any) {
      console.error("Error generating image:", error);
      res.status(500).json({ error: error.message || "Something went wrong" });
    }
  }
}
