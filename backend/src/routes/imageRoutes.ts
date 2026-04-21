import { Router } from "express";
import { ImageController } from "../controllers/imageController";

const router = Router();

// Endpoint for generating images via Gemini
router.post("/generate-image", ImageController.generateImage);

export default router;
