import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import imageRoutes from "./routes/imageRoutes";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static images from /public/images folder
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// Routes
app.use("/", imageRoutes);

// Ported routes from old server.js
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "IndusGPT Backend is running" });
});

// AI Chat endpoint (placeholder)
app.post("/api/chat", (req: Request, res: Response) => {
  const { message } = req.body;
  
  if (!message) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  // TODO: Integrate with AI service (OpenAI, Anthropic, etc.)
  res.json({
    id: Date.now(),
    message: message,
    response: "This is a placeholder response. Connect your AI service here.",
    timestamp: new Date()
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`IndusGPT Backend is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
