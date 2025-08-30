import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { generateTweetsSchema, type GenerateTweetsRequest, type StylePreferences } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import StyleCustomization from "@/components/style-customization";
import GeneratedTweets from "@/components/generated-tweets";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface GeneratedTweet {
  content: string;
  characterCount: number;
  style: StylePreferences & {
    tone: string;
    length: string;
  };
}

export default function TweetGenerator() {
  const [generatedTweets, setGeneratedTweets] = useState<GeneratedTweet[]>([]);
  const [inputLength, setInputLength] = useState(0);
  const { toast } = useToast();

  const form = useForm<GenerateTweetsRequest>({
    resolver: zodResolver(generateTweetsSchema),
    defaultValues: {
      input: "",
      preferences: {
        tone: "autonomous",
        includeEmojis: true,
        length: "expanded",
        includeHashtags: true,
        addCallToAction: false,
        includeQuestions: false,
      },
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (data: GenerateTweetsRequest) => {
      const response = await apiRequest("POST", "/api/generate-tweets", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setGeneratedTweets(data.tweets);
        toast({
          title: "Success!",
          description: "Generated new tweet variations successfully.",
        });
      } else {
        throw new Error(data.error || "Failed to generate tweets");
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate tweets. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: GenerateTweetsRequest) => {
    generateMutation.mutate(data);
  };

  const handleInputChange = (value: string) => {
    setInputLength(value.length);
    form.setValue("input", value);
  };

  const handlePreferencesChange = (preferences: StylePreferences) => {
    form.setValue("preferences", preferences);
  };

  const handleRegenerate = () => {
    const currentData = form.getValues();
    if (currentData.input.trim()) {
      generateMutation.mutate(currentData);
    } else {
      toast({
        title: "Input Required",
        description: "Please enter some text to generate tweets.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fab fa-twitter text-primary-foreground text-sm"></i>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Tweet Generator</h1>
                <p className="text-sm text-muted-foreground">AI-powered content creation</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <i className="fas fa-user text-muted-foreground text-sm"></i>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Card */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="topic-input" className="block text-sm font-medium text-foreground mb-2">
                      What would you like to tweet about?
                    </Label>
                    <Textarea
                      data-testid="input-topic"
                      id="topic-input"
                      placeholder="Enter your topic, idea, or raw text here..."
                      className="min-h-[120px] resize-none"
                      value={form.watch("input")}
                      onChange={(e) => handleInputChange(e.target.value)}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-muted-foreground">Provide context, keywords, or a rough draft</p>
                      <span className="text-xs text-muted-foreground" data-testid="text-character-count">
                        {inputLength} characters
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generated Tweets Section */}
            <GeneratedTweets
              tweets={generatedTweets}
              isLoading={generateMutation.isPending}
              onRegenerate={handleRegenerate}
            />
          </div>

          {/* Style Customization Sidebar */}
          <div className="lg:col-span-1">
            <StyleCustomization
              preferences={form.watch("preferences")}
              onPreferencesChange={handlePreferencesChange}
              onGenerate={() => form.handleSubmit(onSubmit)()}
              isLoading={generateMutation.isPending}
              hasInput={!!form.watch("input").trim()}
            />
          </div>
        </form>

        {/* Usage Instructions */}
        <div className="mt-12 bg-secondary/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <i className="fas fa-lightbulb text-primary mr-2"></i>
            How to Use
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">1</div>
              <div>
                <h4 className="font-medium text-foreground">Input</h4>
                <p className="text-sm text-muted-foreground">Enter your topic, idea, or raw text</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">2</div>
              <div>
                <h4 className="font-medium text-foreground">Customize</h4>
                <p className="text-sm text-muted-foreground">Select tone, emojis, and length preferences</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">3</div>
              <div>
                <h4 className="font-medium text-foreground">Generate</h4>
                <p className="text-sm text-muted-foreground">AI creates multiple tweet variations</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">4</div>
              <div>
                <h4 className="font-medium text-foreground">Copy & Share</h4>
                <p className="text-sm text-muted-foreground">Select and copy your favorite option</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <i className="fab fa-twitter text-primary-foreground text-xs"></i>
              </div>
              <span className="text-sm text-muted-foreground">Powered by Sentient Agent Framework</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Built with ❤️ for content creators
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
