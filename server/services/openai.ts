import { type StylePreferences } from "@shared/schema";

export interface GeneratedTweet {
  content: string;
  characterCount: number;
  style: {
    tone: string;
    includeEmojis: boolean;
    length: string;
    includeHashtags: boolean;
    addCallToAction: boolean;
    includeQuestions: boolean;
  };
}

function generateTweetVariation(
  input: string, 
  preferences: StylePreferences, 
  style: 'direct' | 'engaging' | 'informative'
): string {
  const { tone, includeEmojis, length, includeHashtags, addCallToAction, includeQuestions } = preferences;
  
  // Clean and prepare the input
  const cleanInput = input.trim();
  
  // Base tweet content based on style
  let tweetContent = '';
  
  switch (style) {
    case 'direct':
      tweetContent = tone === 'professional' 
        ? `${cleanInput}.`
        : `${cleanInput}!`;
      break;
    case 'engaging':
      if (includeQuestions) {
        tweetContent = tone === 'professional'
          ? `Thoughts on ${cleanInput.toLowerCase()}? Let's discuss.`
          : `What do you think about ${cleanInput.toLowerCase()}? 🤔`;
      } else {
        tweetContent = tone === 'professional'
          ? `Exploring the impact of ${cleanInput.toLowerCase()}.`
          : `Diving deep into ${cleanInput.toLowerCase()}...`;
      }
      break;
    case 'informative':
      tweetContent = tone === 'professional'
        ? `Key insight: ${cleanInput}.`
        : `Here's the thing about ${cleanInput.toLowerCase()}:`;
      break;
  }
  
  // Add length adjustments
  if (length === 'expanded' && tweetContent.length < 100) {
    switch (style) {
      case 'direct':
        tweetContent = tone === 'professional'
          ? `Important update: ${cleanInput}. This development represents a significant step forward.`
          : `Breaking: ${cleanInput}! This is huge and here's why it matters.`;
        break;
      case 'engaging':
        tweetContent = tone === 'professional'
          ? `I've been analyzing ${cleanInput.toLowerCase()} and the implications are fascinating. What are your thoughts on this development?`
          : `Can we talk about ${cleanInput.toLowerCase()}? This is blowing my mind and I need to share why!`;
        break;
      case 'informative':
        tweetContent = tone === 'professional'
          ? `Research shows that ${cleanInput.toLowerCase()} is becoming increasingly important. Here's what you need to know.`
          : `Everything you need to know about ${cleanInput.toLowerCase()}: it's changing the game in ways you might not expect.`;
        break;
    }
  }
  
  // Add emojis if requested
  if (includeEmojis) {
    const emojiMap = {
      direct: tone === 'professional' ? '📊' : '🚀',
      engaging: tone === 'professional' ? '💡' : '🔥',
      informative: tone === 'professional' ? '📝' : '💭'
    };
    tweetContent = `${emojiMap[style]} ${tweetContent}`;
  }
  
  // Add hashtags if requested
  if (includeHashtags) {
    const words = cleanInput.split(' ').slice(0, 2);
    const hashtags = words
      .map(word => word.replace(/[^a-zA-Z0-9]/g, ''))
      .filter(word => word.length > 2)
      .map(word => `#${word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()}`)
      .slice(0, 2);
    
    if (hashtags.length > 0) {
      tweetContent += ` ${hashtags.join(' ')}`;
    }
  }
  
  // Add call-to-action if requested
  if (addCallToAction) {
    const ctas = tone === 'professional' 
      ? ['Share your thoughts below.', 'What\'s your take?', 'Join the discussion.']
      : ['Drop your thoughts! 👇', 'What do you think?', 'Let me know! ⬇️'];
    const randomCta = ctas[Math.floor(Math.random() * ctas.length)];
    tweetContent += ` ${randomCta}`;
  }
  
  // Ensure tweet is within character limits
  if (tweetContent.length > 280) {
    tweetContent = tweetContent.substring(0, 277) + '...';
  }
  
  return tweetContent;
}

export async function generateTweets(
  input: string,
  preferences: StylePreferences
): Promise<GeneratedTweet[]> {
  try {
    // Generate 3 tweet variations using built-in logic
    const tweets = [
      generateTweetVariation(input, preferences, 'direct'),
      generateTweetVariation(input, preferences, 'engaging'),
      generateTweetVariation(input, preferences, 'informative')
    ];

    return tweets.map(content => ({
      content,
      characterCount: content.length,
      style: {
        tone: preferences.tone,
        includeEmojis: preferences.includeEmojis,
        length: preferences.length,
        includeHashtags: preferences.includeHashtags,
        addCallToAction: preferences.addCallToAction,
        includeQuestions: preferences.includeQuestions,
      }
    }));

  } catch (error) {
    console.error("Tweet generation error:", error);
    throw new Error(`Failed to generate tweets: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

