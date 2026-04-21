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
// AI CHAT ENDPOINT (IMPROVED ERROR LOGGING)
// =====================
app.post("/api/chat", async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      console.error("❌ GEMINI_API_KEY is not defined in process.env");
      return res.status(500).json({ 
        role: "assistant", 
        content: "❌ Configuration Error: GEMINI_API_KEY is missing on Render." 
      });
    }

    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] }),
      }
    );

    const data: any = await aiRes.json();

    // Agar Gemini error return karta hai (e.g. Invalid Key, Quota Exceeded)
    if (data.error) {
      console.error("Gemini API Error Detail:", JSON.stringify(data.error, null, 2));
      return res.status(500).json({ 
        role: "assistant", 
        content: `⚠️ Gemini API Error: ${data.error.message} (Code: ${data.error.code})` 
      });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.error("Unexpected Gemini Response Structure:", JSON.stringify(data, null, 2));
      return res.status(500).json({ 
        role: "assistant", 
        content: "⚠️ AI returned an empty response. Please check if your message violates safety guidelines." 
      });
    }

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