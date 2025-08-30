import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface GeneratedTweet {
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

interface GeneratedTweetsProps {
  tweets: GeneratedTweet[];
  isLoading: boolean;
  onRegenerate: () => void;
}

export default function GeneratedTweets({ tweets, isLoading, onRegenerate }: GeneratedTweetsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [favoriteIndex, setFavoriteIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      toast({
        title: "Copied!",
        description: "Tweet copied to clipboard successfully.",
      });
      
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy tweet to clipboard.",
        variant: "destructive",
      });
    }
  };

  const toggleFavorite = (index: number) => {
    setFavoriteIndex(favoriteIndex === index ? null : index);
  };

  const getStyleIcons = (style: GeneratedTweet['style']) => {
    const icons = [];
    
    if (style.tone === 'professional') {
      icons.push({ icon: 'fas fa-briefcase', text: 'Professional' });
    } else {
      icons.push({ icon: 'fas fa-smile', text: 'Autonomous' });
    }
    
    if (style.includeEmojis) {
      icons.push({ icon: 'fas fa-laugh', text: 'With emojis' });
    } else {
      icons.push({ icon: 'fas fa-minus-circle', text: 'No emojis' });
    }
    
    if (style.length === 'concise') {
      icons.push({ icon: 'fas fa-compress-arrows-alt', text: 'Concise' });
    } else {
      icons.push({ icon: 'fas fa-expand-arrows-alt', text: 'Expanded' });
    }
    
    return icons;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Generated Tweets</h3>
          <Button
            data-testid="button-regenerate"
            variant="secondary"
            size="sm"
            onClick={onRegenerate}
            disabled={isLoading}
          >
            <i className="fas fa-refresh text-xs mr-2"></i>
            <span>Regenerate</span>
          </Button>
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <div className="loading-spinner"></div>
              <span className="text-muted-foreground">Generating tweets...</span>
            </div>
          </div>
        )}
        
        {/* Tweet Options */}
        {!isLoading && tweets.length > 0 && (
          <div className="space-y-4">
            {tweets.map((tweet, index) => (
              <div
                key={index}
                className="tweet-card p-4 border border-border rounded-lg bg-background/50 hover:bg-background transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      index === 0 ? 'bg-primary/10 text-primary' :
                      index === 1 ? 'bg-accent/10 text-accent-foreground' :
                      'bg-secondary/50 text-secondary-foreground'
                    }`}>
                      Option {index + 1}
                    </span>
                    <span className="text-xs text-muted-foreground" data-testid={`text-character-count-${index}`}>
                      {tweet.characterCount} chars
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid={`button-copy-${index}`}
                      onClick={() => copyToClipboard(tweet.content, index)}
                      className="p-1.5 h-auto"
                      title="Copy to clipboard"
                    >
                      <i className={`fas ${copiedIndex === index ? 'fa-check text-green-500' : 'fa-copy'} text-muted-foreground text-xs`}></i>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid={`button-favorite-${index}`}
                      onClick={() => toggleFavorite(index)}
                      className="p-1.5 h-auto"
                      title="Favorite"
                    >
                      <i className={`fa${favoriteIndex === index ? 's' : 'r'} fa-heart ${favoriteIndex === index ? 'text-red-500' : 'text-muted-foreground'} text-xs`}></i>
                    </Button>
                  </div>
                </div>
                <p className="text-foreground leading-relaxed mb-3" data-testid={`text-tweet-content-${index}`}>
                  {tweet.content}
                </p>
                <div className="flex items-center space-x-4 pt-3 border-t border-border">
                  {getStyleIcons(tweet.style).map((item, iconIndex) => (
                    <div key={iconIndex} className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <i className={item.icon}></i>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && tweets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <i className="fas fa-magic text-4xl mb-2"></i>
              <p>No tweets generated yet</p>
              <p className="text-sm">Enter your topic and click "Generate Tweets" to get started</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
