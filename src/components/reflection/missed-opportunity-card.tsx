import React from 'react';
import { SpiritualCard, SpiritualCardHeader, SpiritualCardTitle, SpiritualCardContent } from '@/components/ui/spiritual-card';
import { ItemChip } from '@/components/ui/item-chip';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Lightbulb, Target } from 'lucide-react';
import { type CatalogItem, type SelectedState } from '@/types';

interface MissedOpportunityCardProps {
  missedOpportunityItems: CatalogItem[];
  selectedState: SelectedState;
  note: string;
  intention: string;
  onNoteChange: (note: string) => void;
  onIntentionChange: (intention: string) => void;
  onItemToggle: (itemId: string) => void;
  getItemUsageCount: (itemId: string) => number;
}

export function MissedOpportunityCard({
  missedOpportunityItems,
  selectedState,
  note,
  intention,
  onNoteChange,
  onIntentionChange,
  onItemToggle,
  getItemUsageCount,
}: MissedOpportunityCardProps) {
  const hasMissedSelected = missedOpportunityItems.some(item => selectedState.ids.includes(item.id));

  return (
    <SpiritualCard variant="peaceful" className="border-amber-200 dark:border-amber-900">
      <SpiritualCardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-600" />
          <SpiritualCardTitle className="text-amber-700 dark:text-amber-400">
            Missed Opportunities for Closeness
          </SpiritualCardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Times when you could have been more conscious of Allah or acted with greater spiritual awareness
        </p>
      </SpiritualCardHeader>
      <SpiritualCardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {missedOpportunityItems.map(item => (
            <ItemChip
              key={item.id}
              emoji={item.emoji}
              label={item.title}
              variant="missed_opportunity"
              selected={selectedState.ids.includes(item.id)}
              usageCount={getItemUsageCount(item.id)}
              quantity={selectedState.qty[item.id]}
              onToggle={() => onItemToggle(item.id)}
              onLongPress={() => {}} // TODO: Implement quantity selector
            />
          ))}
        </div>

        {hasMissedSelected && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="missed-note" className="text-sm font-medium">
                Reflection on the missed opportunity
              </Label>
              <Textarea
                id="missed-note"
                placeholder="What was the situation? How could you have been more mindful of Allah?"
                value={note}
                onChange={(e) => onNoteChange(e.target.value)}
                className="resize-none border-amber-200 dark:border-amber-900 mt-1"
                rows={2}
              />
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-amber-600" />
                <Label htmlFor="intention" className="font-medium text-amber-700 dark:text-amber-400">
                  Next time, I will...
                </Label>
              </div>
              <Textarea
                id="intention"
                placeholder="Set a specific intention for how you'll act differently in similar situations"
                value={intention}
                onChange={(e) => onIntentionChange(e.target.value)}
                className="resize-none border-amber-300 dark:border-amber-700"
                rows={2}
              />
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                "And it is He who created the heavens and earth in truth. And the day He says, 'Be,' and it is, His word is the truth." (6:73)
              </p>
            </div>
          </div>
        )}
      </SpiritualCardContent>
    </SpiritualCard>
  );
}