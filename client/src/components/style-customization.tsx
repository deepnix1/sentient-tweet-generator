import { type StylePreferences } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

interface StyleCustomizationProps {
  preferences: StylePreferences;
  onPreferencesChange: (preferences: StylePreferences) => void;
  onGenerate: () => void;
  isLoading: boolean;
  hasInput: boolean;
}

export default function StyleCustomization({
  preferences,
  onPreferencesChange,
  onGenerate,
  isLoading,
  hasInput,
}: StyleCustomizationProps) {
  const updatePreference = <K extends keyof StylePreferences>(
    key: K,
    value: StylePreferences[K]
  ) => {
    onPreferencesChange({
      ...preferences,
      [key]: value,
    });
  };

  return (
    <Card className="sticky top-24">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Customize Style</h3>
        
        <div className="space-y-6">
          {/* Tone Selection */}
          <div>
            <Label className="block text-sm font-medium text-foreground mb-3">Tone</Label>
            <RadioGroup
              value={preferences.tone}
              onValueChange={(value: "professional" | "autonomous") => 
                updatePreference("tone", value)
              }
              className="space-y-2"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="professional" id="tone-professional" data-testid="radio-tone-professional" />
                <Label htmlFor="tone-professional" className="flex-1 cursor-pointer">
                  <div className="text-sm font-medium text-foreground">Professional</div>
                  <div className="text-xs text-muted-foreground">Formal, business-appropriate language</div>
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="autonomous" id="tone-autonomous" data-testid="radio-tone-autonomous" />
                <Label htmlFor="tone-autonomous" className="flex-1 cursor-pointer">
                  <div className="text-sm font-medium text-foreground">Autonomous</div>
                  <div className="text-xs text-muted-foreground">Casual, engaging, conversational</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Emoji Toggle */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="emoji-toggle" className="text-sm font-medium text-foreground">Include Emojis</Label>
              <Switch
                id="emoji-toggle"
                data-testid="switch-emojis"
                checked={preferences.includeEmojis}
                onCheckedChange={(checked) => updatePreference("includeEmojis", checked)}
              />
            </div>
            <p className="text-xs text-muted-foreground">Add emojis to make tweets more engaging</p>
          </div>

          {/* Length Selection */}
          <div>
            <Label className="block text-sm font-medium text-foreground mb-3">Length</Label>
            <RadioGroup
              value={preferences.length}
              onValueChange={(value: "concise" | "expanded") => 
                updatePreference("length", value)
              }
              className="space-y-2"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="concise" id="length-concise" data-testid="radio-length-concise" />
                <Label htmlFor="length-concise" className="flex-1 cursor-pointer">
                  <div className="text-sm font-medium text-foreground">Concise</div>
                  <div className="text-xs text-muted-foreground">Short and punchy (50-120 chars)</div>
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="expanded" id="length-expanded" data-testid="radio-length-expanded" />
                <Label htmlFor="length-expanded" className="flex-1 cursor-pointer">
                  <div className="text-sm font-medium text-foreground">Expanded</div>
                  <div className="text-xs text-muted-foreground">Detailed explanations (120-280 chars)</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Additional Options */}
          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-foreground mb-3">Additional Options</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hashtags"
                  data-testid="checkbox-hashtags"
                  checked={preferences.includeHashtags}
                  onCheckedChange={(checked) => 
                    updatePreference("includeHashtags", checked as boolean)
                  }
                />
                <Label htmlFor="hashtags" className="text-sm text-foreground cursor-pointer">Include hashtags</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cta"
                  data-testid="checkbox-call-to-action"
                  checked={preferences.addCallToAction}
                  onCheckedChange={(checked) => 
                    updatePreference("addCallToAction", checked as boolean)
                  }
                />
                <Label htmlFor="cta" className="text-sm text-foreground cursor-pointer">Add call-to-action</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="questions"
                  data-testid="checkbox-questions"
                  checked={preferences.includeQuestions}
                  onCheckedChange={(checked) => 
                    updatePreference("includeQuestions", checked as boolean)
                  }
                />
                <Label htmlFor="questions" className="text-sm text-foreground cursor-pointer">Include questions</Label>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            data-testid="button-generate"
            onClick={onGenerate}
            disabled={isLoading || !hasInput}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner mr-2"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <i className="fas fa-magic mr-2"></i>
                <span>Generate Tweets</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
