import React, { useState } from 'react';
import { CatalogItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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

  const chipClasses = `
    relative inline-flex items-center gap-2 px-3 py-2 rounded-full border-2 transition-all
    ${isSelected ? 'ring-2 ring-green-500 ring-offset-2' : ''}
    ${getTypeColor(item.type)}
    hover:shadow-md cursor-pointer
  `;

  return (
    <>
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetTrigger asChild>
          <div className={chipClasses}>
            <span className="text-lg">{item.emoji}</span>
            <span className="font-medium text-sm">{item.title}</span>
            
            {/* Suggested counts display */}
            {item.suggested_counts && item.suggested_counts.length > 0 && (
              <div className="flex gap-1">
                {item.suggested_counts.slice(0, 3).map((suggestedCount) => (
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
        </SheetTrigger>

        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <span className="text-2xl">{item.emoji}</span>
              {item.title}
            </SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            {/* Arabic Text */}
            {item.arabic && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Arabic</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl text-right font-arabic leading-relaxed">
                    {item.arabic}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Transliteration & Meaning */}
            {(item.transliteration || item.meaning) && (
              <Card>
                <CardContent className="pt-6">
                  {item.transliteration && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-muted-foreground">Transliteration</p>
                      <p className="text-lg italic">{item.transliteration}</p>
                    </div>
                  )}
                  {item.meaning && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Meaning</p>
                      <p className="text-lg">{item.meaning}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Count Buttons */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Add</CardTitle>
                <CardDescription>
                  Current count: <span className="font-bold text-lg">{count}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {/* Preset count buttons */}
                  {item.suggested_counts?.map((suggestedCount) => (
                    <Button
                      key={suggestedCount}
                      variant="outline"
                      onClick={() => handleQuickAdd(suggestedCount)}
                      className="h-12 text-lg font-bold"
                    >
                      +{suggestedCount}
                    </Button>
                  ))}
                  
                  {/* Common quick add buttons */}
                  <Button
                    variant="outline"
                    onClick={() => handleQuickAdd(1)}
                    className="h-12 text-lg font-bold"
                  >
                    +1
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleQuickAdd(10)}
                    className="h-12 text-lg font-bold"
                  >
                    +10
                  </Button>
                </div>

                <Separator className="my-4" />

                {/* Manual count adjustment */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCountChange(count - 1)}
                    disabled={count <= 0}
                  >
                    -
                  </Button>
                  <span className="text-2xl font-bold min-w-[3rem] text-center">
                    {count}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCountChange(count + 1)}
                  >
                    +
                  </Button>
                  {count > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCountChange(0)}
                      className="text-red-600"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Context & Reference */}
            {(item.context || item.hadith_reference || item.description) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {item.context && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Context</p>
                      <p className="capitalize">{item.context.replace('_', ' ')}</p>
                    </div>
                  )}
                  {item.description && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Description</p>
                      <p>{item.description}</p>
                    </div>
                  )}
                  {item.hadith_reference && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Reference</p>
                      <p className="text-sm bg-muted p-2 rounded">{item.hadith_reference}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Usage Stats */}
            {usageCount > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    You've logged this deed <span className="font-bold">{usageCount}</span> times
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
