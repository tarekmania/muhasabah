import React from 'react';
import { cn } from '@/lib/utils';

interface MoodSelectorProps {
  value?: number;
  onChange: (mood: number) => void;
}

const moods = [
  { value: 1, emoji: '😔', label: 'Struggling' },
  { value: 2, emoji: '😐', label: 'Okay' },
  { value: 3, emoji: '😊', label: 'Good' },
  { value: 4, emoji: '😄', label: 'Great' },
  { value: 5, emoji: '😁', label: 'Excellent' },
];

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground text-center">
        How was your day overall?
      </p>
      <div className="flex justify-center gap-2">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => onChange(mood.value)}
            className={cn(
              "flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all hover:scale-105",
              value === mood.value
                ? "border-primary bg-primary/10 shadow-spiritual"
                : "border-border hover:border-primary/50"
            )}
          >
            <span className="text-3xl">{mood.emoji}</span>
            <span className="text-xs font-medium">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
