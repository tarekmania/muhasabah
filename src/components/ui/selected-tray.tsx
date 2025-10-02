import React, { useState } from 'react';
import { CatalogItem, SelectedState } from '@/types';
import { Button } from './button';
import { Check } from 'lucide-react';
import { Badge } from './badge';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';

interface SelectedTrayProps {
  selectedItems: CatalogItem[];
  selectedState: SelectedState;
  onCountChange: (itemId: string, newCount: number) => void;
  onRemoveItem: (itemId: string) => void;
  onSaveToday: () => void;
  onClear: () => void;
  isVisible: boolean;
}

export function SelectedTray({
  selectedItems,
  selectedState,
  onSaveToday,
  onClear,
  isVisible
}: SelectedTrayProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isVisible || selectedItems.length === 0) {
    return null;
  }

  const totalCount = Object.values(selectedState.qty).reduce((sum, count) => sum + count, 0);

  const handleConfirm = () => {
    onSaveToday();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className={cn(
            "fixed bottom-20 right-4 z-40 h-14 px-6 rounded-full shadow-lg",
            "animate-in slide-in-from-bottom-2"
          )}
        >
          <Check className="h-5 w-5 mr-2" />
          Add {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'}
          <Badge variant="secondary" className="ml-2">
            {totalCount}
          </Badge>
        </Button>
      </SheetTrigger>

      <SheetContent side="bottom" className="h-[60vh]">
        <SheetHeader>
          <SheetTitle>Selected Items</SheetTitle>
          <SheetDescription>
            Review items to add to today's entry. Adjust quantities later in the balance sheet.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-3 overflow-y-auto max-h-[calc(60vh-180px)]">
          {selectedItems.map((item) => {
            const count = selectedState.qty[item.id] || 1;
            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border",
                  item.type === 'GOOD' && "bg-primary/5 border-primary/20",
                  item.type === 'IMPROVE' && "bg-muted/50 border-border",
                  item.type === 'SEVERE' && "bg-destructive/5 border-destructive/20",
                  item.type === 'MISSED_OPPORTUNITY' && "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900"
                )}
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {count}×
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 mt-6">
          <Button variant="outline" onClick={onClear} className="flex-1">
            Clear All
          </Button>
          <Button onClick={handleConfirm} className="flex-1">
            Add to Today
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
