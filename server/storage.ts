import { type Tweet, type InsertTweet, type TweetGenerationRequest, type InsertTweetGenerationRequest } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createTweet(tweet: InsertTweet): Promise<Tweet>;
  getTweetsByInput(input: string): Promise<Tweet[]>;
  createTweetGenerationRequest(request: InsertTweetGenerationRequest): Promise<TweetGenerationRequest>;
  getTweetGenerationRequest(id: string): Promise<TweetGenerationRequest | undefined>;
}

export class MemStorage implements IStorage {
  private tweets: Map<string, Tweet>;
  private tweetGenerationRequests: Map<string, TweetGenerationRequest>;

  constructor() {
    this.tweets = new Map();
    this.tweetGenerationRequests = new Map();
  }

  async createTweet(insertTweet: InsertTweet): Promise<Tweet> {
    const id = randomUUID();
    const tweet: Tweet = { 
      ...insertTweet, 
      id,
      includeEmojis: insertTweet.includeEmojis ?? false,
      includeHashtags: insertTweet.includeHashtags ?? false,
      addCallToAction: insertTweet.addCallToAction ?? false,
      includeQuestions: insertTweet.includeQuestions ?? false,
    };
    this.tweets.set(id, tweet);
    return tweet;
  }

  async getTweetsByInput(input: string): Promise<Tweet[]> {
    return Array.from(this.tweets.values()).filter(
      (tweet) => tweet.originalInput === input,
    );
  }

  async createTweetGenerationRequest(insertRequest: InsertTweetGenerationRequest): Promise<TweetGenerationRequest> {
    const id = randomUUID();
    const request: TweetGenerationRequest = { 
      ...insertRequest, 
      id,
      createdAt: new Date().toISOString()
    };
    this.tweetGenerationRequests.set(id, request);
    return request;
  }

  async getTweetGenerationRequest(id: string): Promise<TweetGenerationRequest | undefined> {
    return this.tweetGenerationRequests.get(id);
  }
}

export const storage = new MemStorage();
