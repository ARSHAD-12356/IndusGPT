import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import imageRoutes from "./routes/imageRoutes";

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// =====================
// MIDDLEWARE
// =====================
app.use(cors({ origin: "*" }));
app.use(express.json());

// =====================
// STATIC FILES
// =====================
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// =====================
// ROOT ROUTE
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
    timestamp: new Date(),
  });
});

// =====================
// AI CHAT ENDPOINT (OPENROUTER)
// =====================
app.post("/api/chat", async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();

    if (!apiKey) {
      console.error("❌ OPENROUTER_API_KEY is not defined");
      return res.status(500).json({ 
        role: "assistant", 
        content: "❌ Configuration Error: OPENROUTER_API_KEY is missing on Render." 
      });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://indusgpt.vercel.app", // Optional, for OpenRouter rankings
        "X-Title": "IndusGPT", // Optional
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "openrouter/free", // Reliable Free Model Router
        "messages": [
          { "role": "user", "content": message }
        ],
      })
    });

    const data: any = await response.json();

    if (data.error) {
      console.error("OpenRouter API Error:", data.error);
      return res.status(500).json({ 
        role: "assistant", 
        content: `⚠️ OpenRouter Error: ${data.error.message || "Unknown error"}` 
      });
    }

    const reply = data?.choices?.[0]?.message?.content || "⚠️ No response from AI.";

    res.json({
      role: "assistant",
      content: reply,
    });

  } catch (error: any) {
    console.error("🔥 Server Error:", error);
    res.status(500).json({
      role: "assistant",
      content: `⚠️ Connection Error: ${error.message || "Failed to reach AI server"}`
    });
  }
});

// =====================
// ERROR HANDLER
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
    path: req.originalUrl,
  });
});

// =====================
// START SERVER
// =====================
app.listen(PORT, () => {
  console.log(`🚀 IndusGPT Backend running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});