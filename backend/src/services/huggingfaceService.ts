import { HfInference } from "@huggingface/inference";

/**
 * Service to handle Hugging Face API integration for image generation using the official SDK.
 */
export class HuggingFaceService {
  /**
   * Generates an image based on the provided prompt using the Hugging Face API.
   * @param prompt The text description of the image to generate
   * @returns Base64 encoded string of the generated image
   */
  public static async generateImage(prompt: string): Promise<string> {
    const apiKey = process.env.HF_API_KEY;

    if (!apiKey) {
      throw new Error("HF_API_KEY is not defined in environment variables");
    }

    // Initialize the Hugging Face Inference client
    const hf = new HfInference(apiKey);

    try {
      // Call the text-to-image API securely using the official SDK
      const blob = (await hf.textToImage({
        model: "stabilityai/stable-diffusion-xl-base-1.0",
        inputs: prompt,
      })) as any;

      // Convert the resulting Blob to an ArrayBuffer, then to a Base64 string
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = buffer.toString("base64");

      if (!base64Image) {
        throw new Error("Failed to convert the generated image to base64.");
      }

      return base64Image;
    } catch (error: any) {
      console.error("HF API Error Response:", error);
      throw new Error(`Hugging Face API Error: ${error.message}`);
    }
  }
}
