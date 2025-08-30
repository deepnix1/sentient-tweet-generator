import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateTweetsSchema, stylePreferencesSchema } from "@shared/schema";
import { generateTweets } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate tweets endpoint
  app.post("/api/generate-tweets", async (req, res) => {
    try {
      const { input, preferences } = generateTweetsSchema.parse(req.body);
      
      const generatedTweets = await generateTweets(input, preferences);
      
      // Store the generation request for future reference
      const request = await storage.createTweetGenerationRequest({
        input,
        preferences,
        generatedTweets
      });

      // Store individual tweets
      const savedTweets = await Promise.all(
        generatedTweets.map(tweet => 
          storage.createTweet({
            content: tweet.content,
            characterCount: tweet.characterCount,
            tone: preferences.tone,
            includeEmojis: preferences.includeEmojis,
            length: preferences.length,
            includeHashtags: preferences.includeHashtags,
            addCallToAction: preferences.addCallToAction,
            includeQuestions: preferences.includeQuestions,
            originalInput: input
          })
        )
      );

      res.json({
        success: true,
        tweets: generatedTweets,
        requestId: request.id
      });

    } catch (error) {
      console.error("Generate tweets error:", error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate tweets"
      });
    }
  });

  // Get tweets by input
  app.get("/api/tweets", async (req, res) => {
    try {
      const { input } = req.query;
      
      if (!input || typeof input !== 'string') {
        return res.status(400).json({
          success: false,
          error: "Input parameter is required"
        });
      }

      const tweets = await storage.getTweetsByInput(input);
      
      res.json({
        success: true,
        tweets
      });

    } catch (error) {
      console.error("Get tweets error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve tweets"
      });
    }
  });

  // Get generation request by ID
  app.get("/api/generation-requests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const request = await storage.getTweetGenerationRequest(id);
      
      if (!request) {
        return res.status(404).json({
          success: false,
          error: "Generation request not found"
        });
      }

      res.json({
        success: true,
        request
      });

    } catch (error) {
      console.error("Get generation request error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve generation request"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
