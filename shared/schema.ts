import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tweets = pgTable("tweets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  characterCount: integer("character_count").notNull(),
  tone: text("tone").notNull(), // 'professional' | 'autonomous'
  includeEmojis: boolean("include_emojis").notNull().default(false),
  length: text("length").notNull(), // 'concise' | 'expanded'
  includeHashtags: boolean("include_hashtags").notNull().default(false),
  addCallToAction: boolean("add_call_to_action").notNull().default(false),
  includeQuestions: boolean("include_questions").notNull().default(false),
  originalInput: text("original_input").notNull(),
});

export const tweetGenerationRequests = pgTable("tweet_generation_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  input: text("input").notNull(),
  preferences: jsonb("preferences").notNull(),
  generatedTweets: jsonb("generated_tweets").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertTweetSchema = createInsertSchema(tweets).omit({
  id: true,
});

export const insertTweetGenerationRequestSchema = createInsertSchema(tweetGenerationRequests).omit({
  id: true,
  createdAt: true,
});

export const stylePreferencesSchema = z.object({
  tone: z.enum(['professional', 'autonomous']),
  includeEmojis: z.boolean(),
  length: z.enum(['concise', 'expanded']),
  includeHashtags: z.boolean(),
  addCallToAction: z.boolean(),
  includeQuestions: z.boolean(),
});

export const generateTweetsSchema = z.object({
  input: z.string().min(1, "Input is required"),
  preferences: stylePreferencesSchema,
});

export type InsertTweet = z.infer<typeof insertTweetSchema>;
export type Tweet = typeof tweets.$inferSelect;
export type InsertTweetGenerationRequest = z.infer<typeof insertTweetGenerationRequestSchema>;
export type TweetGenerationRequest = typeof tweetGenerationRequests.$inferSelect;
export type StylePreferences = z.infer<typeof stylePreferencesSchema>;
export type GenerateTweetsRequest = z.infer<typeof generateTweetsSchema>;
