import React, { useState } from 'react';
import { SpiritualCard, SpiritualCardContent, SpiritualCardHeader, SpiritualCardTitle } from '@/components/ui/spiritual-card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Heart, Sparkles, ChevronRight } from 'lucide-react';

interface GuidedReflectionCardProps {
  note: string;
  onNoteChange: (note: string) => void;
  mood?: 'struggling' | 'stable' | 'growing' | 'thriving';
  onMoodChange?: (mood: 'struggling' | 'stable' | 'growing' | 'thriving') => void;
  hasSelectedItems: boolean;
}

const reflectionPrompts = [
  {
    question: "Why did this happen?",
    verse: "Indeed, Allah will not change the condition of a people until they change what is in themselves. (Quran 13:11)",
    emoji: "🤔"
  },
  {
    question: "How did this make you feel?",
    verse: "And seek help through patience and prayer. (Quran 2:45)",
    emoji: "💭"
  },
  {
    question: "What will you do differently next time?",
    verse: "Indeed, good deeds do away with misdeeds. (Quran 11:114)",
    emoji: "🎯"
  },
  {
    question: "What are you grateful for today?",
    verse: "If you are grateful, I will surely increase you [in favor]. (Quran 14:7)",
    emoji: "🙏"
  }
];

const moods = [
  { id: 'struggling', label: 'Struggling', emoji: '😔', color: 'bg-destructive/10 border-destructive/30 text-destructive' },
  { id: 'stable', label: 'Stable', emoji: '😌', color: 'bg-muted/50 border-border text-foreground' },
  { id: 'growing', label: 'Growing', emoji: '🌱', color: 'bg-secondary/20 border-secondary/40 text-secondary-foreground' },
  { id: 'thriving', label: 'Thriving', emoji: '✨', color: 'bg-primary/10 border-primary/30 text-primary' }
] as const;

export function GuidedReflectionCard({ 
  note, 
  onNoteChange, 
  mood, 
  onMoodChange,
  hasSelectedItems 
}: GuidedReflectionCardProps) {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [showGuidance, setShowGuidance] = useState(false);

  const currentPrompt = reflectionPrompts[currentPromptIndex];

  const nextPrompt = () => {
    setCurrentPromptIndex((prev) => (prev + 1) % reflectionPrompts.length);
  };

  if (!hasSelectedItems) {
    return null;
  }

  return (
    <SpiritualCard variant="peaceful" className="animate-fade-in">
      <SpiritualCardHeader>
        <SpiritualCardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Guided Reflection
        </SpiritualCardTitle>
      </SpiritualCardHeader>
      <SpiritualCardContent className="space-y-4">
        {/* Mood Selector */}
        {onMoodChange && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">How are you feeling spiritually?</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {moods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onMoodChange(m.id)}
                  className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    mood === m.id 
                      ? m.color 
                      : 'bg-background border-border hover:border-primary/30'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{m.emoji}</div>
                    <div className="text-xs font-medium">{m.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Guided Prompts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Reflection Prompts</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowGuidance(!showGuidance)}
              className="text-xs"
            >
              <BookOpen className="h-3 w-3 mr-1" />
              {showGuidance ? 'Hide' : 'Show'} Guidance
            </Button>
          </div>

          {showGuidance && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3 animate-fade-in">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{currentPrompt.emoji}</span>
                <div className="flex-1">
                  <p className="font-medium text-primary mb-2">{currentPrompt.question}</p>
                  <p className="text-xs text-muted-foreground italic leading-relaxed">
                    {currentPrompt.verse}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={nextPrompt}
                className="w-full"
              >
                Next Prompt
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </div>

        {/* Reflection Text Area */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Reflection</label>
          <Textarea
            placeholder="Reflect on your actions and intentions... What did you learn? What will you improve?"
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            className="resize-none min-h-[120px] focus:ring-2 focus:ring-primary/20"
            rows={5}
          />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            <span>Be honest with yourself - this is between you and Allah</span>
          </div>
        </div>

        {/* Intention Setting */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4 border border-border">
          <p className="text-sm font-medium mb-2 flex items-center gap-2">
            <span className="text-lg">🎯</span>
            Set an intention for tomorrow
          </p>
          <p className="text-xs text-muted-foreground italic">
            "Actions are judged by intentions, so each person will have what they intended." - Prophet Muhammad ﷺ
          </p>
        </div>
      </SpiritualCardContent>
    </SpiritualCard>
  );
}
