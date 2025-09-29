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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
      <Card className="rounded-none border-0 border-t">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <span>Selected</span>
              <Badge variant="secondary">{selectedItems.length}</Badge>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* Selected Items List */}
          <div className="space-y-3 max-h-32 overflow-y-auto mb-4">
            {selectedItems.map((item) => {
              const count = selectedState.qty[item.id] || 0;
              return (
                <div key={item.id} className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-lg">{item.emoji}</span>
                    <span className="font-medium text-sm">{item.title}</span>
                    {item.suggested_counts && item.suggested_counts.length > 0 && (
                      <div className="flex gap-1">
                        {item.suggested_counts.slice(0, 2).map((suggestedCount) => (
                          <Button
                            key={suggestedCount}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickAdd(item.id, suggestedCount)}
                            className="h-6 px-2 text-xs"
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
                        className="h-8 w-8 p-0"
                      >
                        -
                      </Button>
                      <span className="font-bold text-lg min-w-[2rem] text-center">
                        {count}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCountChange(item.id, count + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator className="my-4" />

          {/* Summary and Action */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">{totalCount}</span> total deeds selected
            </div>
            
            <Button 
              onClick={onSaveToday}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6"
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
