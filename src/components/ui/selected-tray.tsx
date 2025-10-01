import React from 'react';
import { CatalogItem, SelectedState } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
  onCountChange,
  onRemoveItem,
  onSaveToday,
  onClear,
  isVisible
}: SelectedTrayProps) {
  if (!isVisible || selectedItems.length === 0) {
    return null;
  }

  const totalCount = Object.values(selectedState.qty).reduce((sum, count) => sum + count, 0);

  const handleQuickAdd = (itemId: string, amount: number) => {
    const currentCount = selectedState.qty[itemId] || 0;
    onCountChange(itemId, currentCount + amount);
  };

  const handleCountChange = (itemId: string, newCount: number) => {
    if (newCount <= 0) {
      onRemoveItem(itemId);
    } else {
      onCountChange(itemId, newCount);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg pb-safe">
      <Card className="rounded-none border-0 border-t">
        <CardHeader className="pb-3 pt-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <span>Selected</span>
              <Badge variant="secondary" className="text-base px-2">{selectedItems.length}</Badge>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-muted-foreground hover:text-foreground h-10 w-10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 pb-4">
          {/* Selected Items List */}
          <div className="space-y-3 max-h-40 overflow-y-auto mb-4">
            {selectedItems.map((item) => {
              const count = selectedState.qty[item.id] || 0;
              return (
                <div key={item.id} className="flex items-center justify-between bg-muted/50 rounded-lg p-3 min-h-[56px]">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-xl">{item.emoji}</span>
                    <span className="font-medium text-base">{item.title}</span>
                    {item.suggested_counts && item.suggested_counts.length > 0 && (
                      <div className="flex gap-1">
                        {item.suggested_counts.slice(0, 2).map((suggestedCount) => (
                          <Button
                            key={suggestedCount}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickAdd(item.id, suggestedCount)}
                            className="h-8 px-3 text-sm min-w-[44px]"
                          >
                            +{suggestedCount}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Count Controls */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCountChange(item.id, count - 1)}
                        className="h-10 w-10 p-0 text-lg"
                      >
                        -
                      </Button>
                      <span className="font-bold text-xl min-w-[2.5rem] text-center">
                        {count}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCountChange(item.id, count + 1)}
                        className="h-10 w-10 p-0"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      className="h-10 w-10 p-0 text-muted-foreground hover:text-red-600"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator className="my-4" />

          {/* Summary and Action */}
          <div className="flex items-center justify-between gap-4">
            <div className="text-base text-muted-foreground">
              <span className="font-medium">{totalCount}</span> total deeds
            </div>
            
            <Button 
              onClick={onSaveToday}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 h-12 text-base"
              disabled={selectedItems.length === 0}
            >
              Add {totalCount} to Today
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
