import React, { useState } from 'react';
import { CatalogItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, Minus, RotateCcw } from 'lucide-react';

interface EnhancedItemChipProps {
  item: CatalogItem;
  count: number;
  onCountChange: (itemId: string, newCount: number) => void;
  usageCount?: number;
  isSelected?: boolean;
}

export function EnhancedItemChip({ 
  item, 
  count, 
  onCountChange, 
  usageCount = 0,
  isSelected = false 
}: EnhancedItemChipProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleQuickAdd = (amount: number) => {
    onCountChange(item.id, count + amount);
  };

  const handleCountChange = (newCount: number) => {
    onCountChange(item.id, Math.max(0, newCount));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'GOOD': return 'bg-green-100 text-green-800 border-green-200';
      case 'IMPROVE': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'SEVERE': return 'bg-red-100 text-red-800 border-red-200';
      case 'MISSED_OPPORTUNITY': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSimpleClick = () => {
    handleQuickAdd(1);
  };

  const chipClasses = `
    relative inline-flex items-center gap-2 px-3 py-2 rounded-full border-2 transition-all
    ${isSelected ? 'ring-2 ring-green-500 ring-offset-2' : ''}
    ${getTypeColor(item.type)}
    hover:shadow-md cursor-pointer
  `;

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <div 
          className={chipClasses}
          onClick={handleSimpleClick}
          onContextMenu={(e) => {
            e.preventDefault();
            setIsPopoverOpen(true);
          }}
        >
          <span className="text-lg">{item.emoji}</span>
          <span className="font-medium text-sm">{item.title}</span>
          
          {/* Suggested counts display */}
          {item.suggested_counts && item.suggested_counts.length > 0 && (
            <div className="flex gap-1">
              {item.suggested_counts.slice(0, 2).map((suggestedCount) => (
                <Badge 
                  key={suggestedCount} 
                  variant="secondary" 
                  className="text-xs px-1.5 py-0.5"
                >
                  {suggestedCount}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Current count */}
          {count > 0 && (
            <Badge className="bg-green-600 text-white font-bold">
              {count}
            </Badge>
          )}
          
          {/* Usage badge */}
          {usageCount > 0 && (
            <Badge variant="outline" className="text-xs">
              ×{usageCount}
            </Badge>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{item.emoji}</span>
            <div>
              <h3 className="font-semibold">{item.title}</h3>
              {item.transliteration && (
                <p className="text-sm text-muted-foreground">{item.transliteration}</p>
              )}
            </div>
          </div>

          {/* Quick Add Buttons */}
          {item.suggested_counts && item.suggested_counts.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Quick Add:</p>
              <div className="flex gap-2 flex-wrap">
                {item.suggested_counts.map((suggestedCount) => (
                  <Button
                    key={suggestedCount}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAdd(suggestedCount)}
                    className="h-8"
                  >
                    +{suggestedCount}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd(10)}
                  className="h-8"
                >
                  +10
                </Button>
              </div>
            </div>
          )}

          {/* Count Controls */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Current Count:</p>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCountChange(count - 1)}
                disabled={count <= 0}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-bold text-lg min-w-[3rem] text-center">
                {count}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCountChange(count + 1)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCountChange(0)}
                className="h-8 w-8 p-0"
                disabled={count <= 0}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Usage Stats */}
          {usageCount > 0 && (
            <div className="text-sm text-muted-foreground">
              Used {usageCount} times before
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
