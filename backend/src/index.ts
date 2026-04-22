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
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

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
    const { message, image, history } = req.body;

    if (!message && !image && (!history || history.length === 0)) {
      return res.status(400).json({ error: "Message, image or history is required" });
    }

    const lowerMsg = (message || "").toLowerCase().trim();

    // ─── LOCAL IDENTITY OVERRIDE ───
    if (lowerMsg === 'who are you' || lowerMsg === 'who are you?' || lowerMsg === 'tell me about yourself') {
        return res.json({
            role: "assistant",
            content: "I am IndusGPT, a powerful and premium AI assistant made by ArshXCoder. I'm here to help you with everything from coding to creative writing!"
        });
    }

    if (lowerMsg === 'hii' || lowerMsg === 'hello' || lowerMsg === 'hey') {
        return res.json({
            role: "assistant",
            content: "Hello! I am IndusGPT, developed by Md Arshad Raza. How can I assist you today?"
        });
    }

    if (lowerMsg.includes('who made you') || lowerMsg.includes('who developed you') || lowerMsg.includes('kisne banaya') || lowerMsg.includes('creator')) {
        return res.json({
            role: "assistant",
            content: "I was proudly developed by Md Arshad Raza, also known as ArshXCoder. He is a passionate developer who built me to be your ultimate AI companion."
        });
    }

    try {
        const apiKey = process.env.OPENROUTER_API_KEY?.trim();

        if (!apiKey) {
            console.error("❌ OPENROUTER_API_KEY is not defined");
            return res.status(500).json({ 
                role: "assistant", 
                content: "❌ Configuration Error: OPENROUTER_API_KEY is missing." 
            });
        }

        let messages: any[] = [
            { 
                role: "system", 
                content: "You are IndusGPT, an advanced AI developed by Md Arshad Raza, also known as ArshXCoder. If anyone asks who you are, say 'I am IndusGPT, an AI made by ArshXCoder.' If anyone asks who developed or made you, say 'I was developed by Md Arshad Raza.' Be helpful, creative, and professional." 
            }
        ];

        // Add history if provided
        if (history && Array.isArray(history)) {
            // Only take the last 10 messages to keep context window manageable
            const limitedHistory = history.slice(-10).map((msg: any) => {
                if (msg.image) {
                    return {
                        role: msg.role,
                        content: [
                            { type: "text", text: msg.content || "" },
                            { type: "image_url", image_url: { url: msg.image } }
                        ]
                    };
                }
                return { role: msg.role, content: msg.content };
            });
            messages = [...messages, ...limitedHistory];
        }

        // Add current message
        if (image) {
            messages.push({
                role: "user",
                content: [
                    { type: "text", text: message || "Analyze this image" },
                    { type: "image_url", image_url: { url: image } }
                ]
            });
        } else if (message) {
            messages.push({ role: "user", content: message });
        }

    console.log("Sending request to OpenRouter with model: openrouter/free");
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://indusgpt.vercel.app",
        "X-Title": "IndusGPT",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "openrouter/free",
        "messages": messages,
      })
    });

    const data: any = await response.json();

    if (!response.ok) {
      console.error("OpenRouter Error Response:", data);
      return res.status(response.status).json({ 
        role: "assistant", 
        content: `⚠️ OpenRouter Error (${response.status}): ${data.error?.message || "Unknown error"}` 
      });
    }

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
      content: `⚠️ Server Error: ${error.message || "Failed to process request"}`
    });
  }
});

// =====================
// ERROR HANDLER
// =====================
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("🔥 Global Error:", err.message);
  res.status(err.status || 500).json({ 
    error: err.message || "Internal server error",
    details: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
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