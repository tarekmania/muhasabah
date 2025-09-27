import React from 'react';
import { Button } from '@/components/ui/button';
import { ItemChip } from '@/components/ui/item-chip';
import { SpiritualCard, SpiritualCardContent } from '@/components/ui/spiritual-card';
import { X, Bookmark, Trash2 } from 'lucide-react';
import { type CatalogItem, type SelectedState } from '@/types';

interface SelectedTrayProps {
  selectedState: SelectedState;
  items: CatalogItem[];
  totalCount: number;
  onRemoveItem: (itemId: string) => void;
  onClear: () => void;
  onSaveAsTemplate?: () => void;
  onAddToToday: () => void;
  className?: string;
}

export function SelectedTray({
  selectedState,
  items,
  totalCount,
  onRemoveItem,
  onClear,
  onSaveAsTemplate,
  onAddToToday,
  className
}: SelectedTrayProps) {
  if (selectedState.ids.length === 0) return null;

  const selectedItems = items.filter(item => selectedState.ids.includes(item.id));

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t shadow-2xl ${className}`}>
      <SpiritualCard variant="elevated" className="m-4 mb-safe">
        <SpiritualCardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Selected</span>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-bold">
                {totalCount}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Selected items chips */}
          <div className="flex flex-wrap gap-2 mb-4 max-h-20 overflow-y-auto">
            {selectedItems.slice(0, 6).map(item => (
              <ItemChip
                key={item.id}
                emoji={item.emoji}
                label={item.title}
                variant={item.type === 'GOOD' ? 'good' : 'improve'}
                selected={true}
                quantity={selectedState.qty[item.id]}
                size="sm"
                onToggle={() => onRemoveItem(item.id)}
              />
            ))}
            {selectedItems.length > 6 && (
              <div className="text-xs text-muted-foreground px-2 py-1">
                +{selectedItems.length - 6} more
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              onClick={onAddToToday}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              Add {totalCount} to Today
            </Button>
            
            {onSaveAsTemplate && (
              <Button
                variant="outline"
                size="lg"
                onClick={onSaveAsTemplate}
                className="px-3"
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            )}
          </div>
        </SpiritualCardContent>
      </SpiritualCard>
    </div>
  );
}