import React from 'react';
import { CatalogItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, Calendar, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedCatalogItemProps {
  item: CatalogItem;
  quantity?: number;
  onSelect?: () => void;
  selected?: boolean;
  showDetails?: boolean;
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const frequencyLabels = {
  daily: 'Daily',
  weekly: 'Weekly',
  occasional: 'Occasional',
  situational: 'When needed',
};

export function EnhancedCatalogItem({ 
  item, 
  quantity, 
  onSelect, 
  selected, 
  showDetails = false 
}: EnhancedCatalogItemProps) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md",
        selected 
          ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
          : "border-border hover:border-primary/50"
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{item.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium text-sm">{item.title}</h4>
            {quantity && quantity > 1 && (
              <Badge variant="secondary" className="text-xs">
                {quantity}×
              </Badge>
            )}
          </div>
          
          {showDetails && (
            <div className="mt-2 space-y-2">
              {/* Difficulty & Frequency */}
              <div className="flex gap-2 flex-wrap">
                {item.difficulty && (
                  <Badge variant="outline" className={cn("text-xs", difficultyColors[item.difficulty])}>
                    <Target className="h-3 w-3 mr-1" />
                    {item.difficulty}
                  </Badge>
                )}
                {item.frequency && (
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {frequencyLabels[item.frequency]}
                  </Badge>
                )}
                {item.time_commitment && (
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {item.time_commitment}
                  </Badge>
                )}
              </div>
              
              {/* Reward Description */}
              {item.reward_description && (
                <div className="flex items-start gap-2">
                  <Award className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground italic">
                    {item.reward_description}
                  </p>
                </div>
              )}
              
              {/* Arabic & Transliteration */}
              {item.arabic && (
                <div className="space-y-1">
                  <p className="text-sm font-serif text-right" dir="rtl">
                    {item.arabic}
                  </p>
                  {item.transliteration && (
                    <p className="text-xs text-muted-foreground italic">
                      {item.transliteration}
                    </p>
                  )}
                  {item.meaning && (
                    <p className="text-xs text-muted-foreground">
                      "{item.meaning}"
                    </p>
                  )}
                </div>
              )}
              
              {/* Hadith Reference */}
              {item.hadith_reference && (
                <p className="text-xs text-primary font-medium">
                  📚 {item.hadith_reference}
                </p>
              )}
              
              {/* Description */}
              {item.description && (
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
