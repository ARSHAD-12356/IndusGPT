import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import imageRoutes from "./routes/imageRoutes";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// =====================
// MIDDLEWARE
// =====================
app.use(cors({
  origin: "*",
}));
app.use(express.json());

// =====================
// STATIC FILES
// =====================
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// =====================
// ROOT ROUTE (FIX NOT FOUND ISSUE)
// =====================
app.get("/", (req: Request, res: Response) => {
  res.send("🚀 IndusGPT Backend is Live!");
});

// =====================
// ROUTES
// =====================
app.use("/", imageRoutes);

// =====================
// HEALTH CHECK
// =====================
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "IndusGPT Backend is running",
    timestamp: new Date()
  });
});

// =====================
// AI CHAT ENDPOINT
// =====================
app.post("/api/chat", (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  res.json({
    id: Date.now(),
    userMessage: message,
    response: `🤖 You said: "${message}" (AI integration coming soon 🚀)`,
    timestamp: new Date()
  });
});

// =====================
// ERROR HANDLING
// =====================
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// =====================
// 404 HANDLER
// =====================
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl
  });
});

// =====================
// START SERVER
// =====================
app.listen(PORT, () => {
  console.log(`🚀 IndusGPT Backend running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
