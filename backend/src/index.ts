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
// AI CHAT ENDPOINT (FIXED)
// =====================
app.post("/api/chat", async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.log("❌ GEMINI_API_KEY missing");
      return res.status(500).json({ error: "API key missing" });
    }

    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    const data: any = await aiRes.json();

    console.log("🔍 Gemini Response:", JSON.stringify(data, null, 2));

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ AI did not return a response";

    // ✅ IMPORTANT: frontend-compatible format
    res.json({
      role: "assistant",
      content: reply,
    });

  } catch (error) {
    console.error("🔥 AI ERROR:", error);
    res.status(500).json({
      role: "assistant",
      content: "⚠️ Something went wrong. Try again.",
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