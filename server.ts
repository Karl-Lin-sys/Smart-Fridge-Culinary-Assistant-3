import { GoogleGenAI, Type } from "@google/genai";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use increased limit because base64 images can be quite large
  app.use(express.json({ limit: '50mb' }));

  // API Route to extract recipes
  app.post("/api/extract-recipes", async (req, res) => {
    try {
      const { image, dietaryRestrictions } = req.body; // image should be base64 string
      if (!image) {
         res.status(400).json({ error: "No image provided" });
         return;
      }

      // Initialize Gemini
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Prepare image
      let base64Data = image;
      let mimeType = 'image/jpeg';
      
      const match = image.match(/^data:(image\/[a-zA-Z]*);base64,(.*)$/);
      if (match) {
        mimeType = match[1];
        base64Data = match[2];
      }

      const promptContext = dietaryRestrictions && dietaryRestrictions.length > 0 
        ? `Additionally, filter the recipes to only include those that are: ${dietaryRestrictions.join(', ')}.` 
        : "";

      const prompt = `Look at the attached image of a fridge interior. Identify all visible ingredients.
Then, suggest up to 5 creative and practical recipes using primarily these ingredients.
${promptContext}
Return the data in a structured JSON format containing the ingredients found and the suggested recipes.
Each recipe should have:
- title
- description
- difficulty (e.g., Easy, Medium, Hard)
- prep_time (e.g., "15 mins")
- calories (integer)
- ingredients: Array of objects with 'name', 'amount', 'isPresent' (true if seen in fridge, false if missing)
- steps: Array of strings explaining the step-by-step instructions.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: {
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              ingredients: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of ingredients identified in the fridge."
              },
              recipes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    difficulty: { type: Type.STRING },
                    prep_time: { type: Type.STRING },
                    calories: { type: Type.INTEGER },
                    ingredients: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          amount: { type: Type.STRING },
                          isPresent: { type: Type.BOOLEAN }
                        },
                        required: ["name", "amount", "isPresent"]
                      }
                    },
                    steps: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    }
                  },
                  required: ["title", "description", "difficulty", "prep_time", "calories", "ingredients", "steps"]
                }
              }
            },
            required: ["ingredients", "recipes"]
          }
        }
      });

      const jsonStr = response.text || "{}";
      const data = JSON.parse(jsonStr);

      res.json(data);
    } catch (error: any) {
      console.error("Error processing request:", error);
      res.status(500).json({ error: error.message || "Failed to process image" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the dist directory
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
