import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb } from 'lucide-react';

interface TomorrowIntentionProps {
  value: string;
  onChange: (value: string) => void;
  suggestions?: string[];
}

export function TomorrowIntention({ value, onChange, suggestions = [] }: TomorrowIntentionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-primary" />
        <label className="text-sm font-medium">What will you focus on tomorrow?</label>
      </div>
      
      {suggestions.length > 0 && (
        <div className="p-3 rounded-lg bg-accent/50 border">
          <p className="text-xs text-muted-foreground mb-2">Suggested focus areas:</p>
          <p className="text-sm">{suggestions.join(', ')}</p>
        </div>
      )}

      <Textarea
        placeholder="Set your intention for tomorrow... (e.g., Wake up for Fajr, Read Quran, Be patient)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[100px] resize-none"
      />
    </div>
  );
}
