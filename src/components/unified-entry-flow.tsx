import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { SpiritualCard, SpiritualCardHeader, SpiritualCardTitle, SpiritualCardContent } from '@/components/ui/spiritual-card';
import { ItemChip } from '@/components/ui/item-chip';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, Heart, ChevronDown, Clock, TrendingUp } from 'lucide-react';
import { useCatalog } from '@/hooks/use-catalog';
import { curated_duas, type Entry, type CatalogItem } from '@/types';
import { cn } from '@/lib/utils';
import { AIInsights } from '@/components/ai-insights';

interface UnifiedEntryFlowProps {
  onSave: (entry: Partial<Entry>) => void;
  existingEntry?: Entry | null;
  targetDate: string;
}

export function UnifiedEntryFlow({ onSave, existingEntry, targetDate }: UnifiedEntryFlowProps) {
  const {
    catalog,
    getItemUsageCount,
    searchItems,
    updateItemUsage,
  } = useCatalog();

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [note, setNote] = useState(existingEntry?.good?.note || existingEntry?.improve?.note || '');

  // Update note when existing entry changes
  useEffect(() => {
    setNote(existingEntry?.good?.note || existingEntry?.improve?.note || '');
  }, [existingEntry?.id]);

  // Search results
  const searchResults = searchQuery ? searchItems(searchQuery) : [];

  // Filter items by type
  const goodItems = catalog.items.filter(item => item.type === 'GOOD');
  const improveItems = catalog.items.filter(item => item.type === 'IMPROVE');
  const severeItems = catalog.items.filter(item => item.type === 'SEVERE');
  const missedOpportunityItems = catalog.items.filter(item => item.type === 'MISSED_OPPORTUNITY');

  // Get frequently used items
  const recentlyUsedItems = useMemo(() => {
    const itemsWithLastUsed = catalog.items.map(item => ({
      item,
      lastUsed: parseInt(localStorage.getItem(`lastUsed_${item.id}`) || '0')
    }));
    return itemsWithLastUsed
      .filter(({ lastUsed }) => lastUsed > 0)
      .sort((a, b) => b.lastUsed - a.lastUsed)
      .slice(0, 6)
      .map(({ item }) => item);
  }, [catalog.items]);

  const mostUsedItems = useMemo(() => {
    return [...catalog.items]
      .sort((a, b) => getItemUsageCount(b.id) - getItemUsageCount(a.id))
      .filter(item => getItemUsageCount(item.id) > 0)
      .slice(0, 6);
  }, [catalog.items, getItemUsageCount]);

  // Check if item is in current entry
  const isItemInEntry = (itemId: string) => {
    if (!existingEntry) return false;
    return [
      ...(existingEntry.good?.itemIds || []),
      ...(existingEntry.improve?.itemIds || []),
      ...(existingEntry.severeSlip?.itemIds || []),
      ...(existingEntry.missedOpportunity?.itemIds || []),
    ].includes(itemId);
  };

  // Direct item toggle - add or remove from entry immediately
  const handleItemToggle = (item: CatalogItem) => {
    const isInEntry = isItemInEntry(item.id);
    
    // Track last used
    localStorage.setItem(`lastUsed_${item.id}`, Date.now().toString());
    
    if (isInEntry) {
      // Remove item from entry
      const updatedEntry: Partial<Entry> = { ...existingEntry };
      
      if (updatedEntry.good?.itemIds?.includes(item.id)) {
        updatedEntry.good = {
          ...updatedEntry.good,
          itemIds: updatedEntry.good.itemIds.filter(id => id !== item.id),
          qty: { ...updatedEntry.good.qty }
        };
        delete updatedEntry.good.qty[item.id];
        if (updatedEntry.good.itemIds.length === 0) updatedEntry.good = null;
      }
      
      if (updatedEntry.improve?.itemIds?.includes(item.id)) {
        updatedEntry.improve = {
          ...updatedEntry.improve,
          itemIds: updatedEntry.improve.itemIds.filter(id => id !== item.id),
          qty: { ...updatedEntry.improve.qty }
        };
        delete updatedEntry.improve.qty[item.id];
        if (updatedEntry.improve.itemIds.length === 0) updatedEntry.improve = null;
      }
      
      if (updatedEntry.severeSlip?.itemIds?.includes(item.id)) {
        updatedEntry.severeSlip = {
          ...updatedEntry.severeSlip,
          itemIds: updatedEntry.severeSlip.itemIds.filter(id => id !== item.id),
          qty: { ...updatedEntry.severeSlip.qty }
        };
        delete updatedEntry.severeSlip.qty[item.id];
        if (updatedEntry.severeSlip.itemIds.length === 0) updatedEntry.severeSlip = null;
      }
      
      if (updatedEntry.missedOpportunity?.itemIds?.includes(item.id)) {
        updatedEntry.missedOpportunity = {
          ...updatedEntry.missedOpportunity,
          itemIds: updatedEntry.missedOpportunity.itemIds.filter(id => id !== item.id),
          qty: { ...updatedEntry.missedOpportunity.qty }
        };
        delete updatedEntry.missedOpportunity.qty[item.id];
        if (updatedEntry.missedOpportunity.itemIds.length === 0) updatedEntry.missedOpportunity = null;
      }
      
      updateItemUsage([item.id]);
      onSave(updatedEntry);
    } else {
      // Add item to entry with quantity 1
      const updatedEntry: Partial<Entry> = {
        ...existingEntry,
        dateISO: targetDate,
      };
      
      if (item.type === 'GOOD') {
        updatedEntry.good = {
          itemIds: [...(existingEntry?.good?.itemIds || []), item.id],
          qty: { ...(existingEntry?.good?.qty || {}), [item.id]: 1 },
          note: note || existingEntry?.good?.note || undefined
        };
      } else if (item.type === 'IMPROVE') {
        updatedEntry.improve = {
          itemIds: [...(existingEntry?.improve?.itemIds || []), item.id],
          qty: { ...(existingEntry?.improve?.qty || {}), [item.id]: 1 },
          note: note || existingEntry?.improve?.note || undefined
        };
      } else if (item.type === 'SEVERE') {
        updatedEntry.severeSlip = {
          itemIds: [...(existingEntry?.severeSlip?.itemIds || []), item.id],
          qty: { ...(existingEntry?.severeSlip?.qty || {}), [item.id]: 1 },
          note: note || existingEntry?.severeSlip?.note || undefined,
          tawbah: true
        };
      } else if (item.type === 'MISSED_OPPORTUNITY') {
        updatedEntry.missedOpportunity = {
          itemIds: [...(existingEntry?.missedOpportunity?.itemIds || []), item.id],
          qty: { ...(existingEntry?.missedOpportunity?.qty || {}), [item.id]: 1 },
          note: note || existingEntry?.missedOpportunity?.note || undefined,
          intention: existingEntry?.missedOpportunity?.intention || undefined
        };
      }
      
      updateItemUsage([item.id]);
      onSave(updatedEntry);
    }
  };

  // Save note changes
  useEffect(() => {
    if (!existingEntry) return;
    
    const timer = setTimeout(() => {
      const updatedEntry: Partial<Entry> = { ...existingEntry };
      
      if (updatedEntry.good) {
        updatedEntry.good = { ...updatedEntry.good, note: note || undefined };
      }
      if (updatedEntry.improve) {
        updatedEntry.improve = { ...updatedEntry.improve, note: note || undefined };
      }
      
      onSave(updatedEntry);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [note]);

  const renderItemChip = (item: CatalogItem) => {
    const isInEntry = isItemInEntry(item.id);
    
    return (
      <ItemChip
        key={item.id}
        emoji={item.emoji}
        label={item.title}
        variant={item.type.toLowerCase() as any}
        selected={isInEntry}
        usageCount={getItemUsageCount(item.id)}
        onToggle={() => handleItemToggle(item)}
        size="default"
        className="min-h-[48px]"
      />
    );
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Main Entry Interface */}
      <SpiritualCard variant="elevated">
        <SpiritualCardHeader>
          <SpiritualCardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-5 w-5" />
            Select Items
          </SpiritualCardTitle>
        </SpiritualCardHeader>
        <SpiritualCardContent className="space-y-4">
          {/* Search Section */}
          <Collapsible open={showSearch} onOpenChange={setShowSearch}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between h-14 text-base">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5" />
                  <span>Search Items</span>
                </div>
                <ChevronDown className={cn("h-5 w-5 transition-transform", showSearch && "rotate-180")} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="space-y-3">
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 text-base"
                  autoFocus
                />
                {searchQuery && (
                  <div className="space-y-3">
                    {searchResults.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2">
                        {searchResults.map((item) => renderItemChip(item))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-6">
                        No items found for "{searchQuery}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Recently Used Section */}
          {!showSearch && recentlyUsedItems.length > 0 && (
            <Collapsible defaultOpen className="mb-4">
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg hover:bg-accent min-h-[48px]">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Recently Used</span>
                  </div>
                  <ChevronDown className="h-5 w-5" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {recentlyUsedItems.map(item => renderItemChip(item))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Most Used Section */}
          {!showSearch && mostUsedItems.length > 0 && (
            <Collapsible defaultOpen className="mb-4">
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg hover:bg-accent min-h-[48px]">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Most Used</span>
                  </div>
                  <ChevronDown className="h-5 w-5" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {mostUsedItems.map(item => renderItemChip(item))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Categories */}
          <div className="space-y-3">
            {catalog.categories.map((category) => {
              const categoryItems = catalog.items.filter(item => item.category_id === category.id);
              const goodCategoryItems = categoryItems.filter(item => item.type === 'GOOD');
              const improveCategoryItems = categoryItems.filter(item => item.type === 'IMPROVE');
              const severeCategoryItems = categoryItems.filter(item => item.type === 'SEVERE');
              const missedCategoryItems = categoryItems.filter(item => item.type === 'MISSED_OPPORTUNITY');
              const isOpen = openCategories[category.id];
              
              return (
                <Collapsible
                  key={category.id}
                  open={isOpen}
                  onOpenChange={(open) => setOpenCategories(prev => ({ ...prev, [category.id]: open }))}
                >
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between h-auto min-h-[3.5rem] py-3 text-base"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.emoji}</span>
                        <div className="text-left">
                          <div className="font-medium">{category.title}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-sm px-2">
                          {categoryItems.length}
                        </Badge>
                        <ChevronDown className={cn("h-5 w-5 transition-transform", isOpen && "rotate-180")} />
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-3">
                    <div className="space-y-4 px-1">
                      {/* Good items */}
                      {goodCategoryItems.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 text-primary flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            Good deeds
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {goodCategoryItems.map(renderItemChip)}
                          </div>
                        </div>
                      )}
                      
                      {/* Improve items */}
                      {improveCategoryItems.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 text-secondary-foreground flex items-center gap-1">
                            <Sparkles className="h-4 w-4" />
                            Areas to improve
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {improveCategoryItems.map(renderItemChip)}
                          </div>
                        </div>
                      )}
                      
                      {/* Severe items */}
                      {severeCategoryItems.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 text-destructive flex items-center gap-1">
                            <span className="text-lg">⚠️</span>
                            Serious matters (Tawbah)
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {severeCategoryItems.map(renderItemChip)}
                          </div>
                        </div>
                      )}
                      
                      {/* Missed opportunities */}
                      {missedCategoryItems.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 text-muted-foreground flex items-center gap-1">
                            <span className="text-lg">💭</span>
                            Missed opportunities
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {missedCategoryItems.map(renderItemChip)}
                          </div>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </SpiritualCardContent>
      </SpiritualCard>

      {/* General Reflection */}
      <SpiritualCard variant="elevated">
        <SpiritualCardHeader>
          <SpiritualCardTitle className="text-base">General Reflection</SpiritualCardTitle>
        </SpiritualCardHeader>
        <SpiritualCardContent>
          <Textarea
            placeholder="Write your thoughts, lessons learned, or any reflections from today..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[150px] resize-none text-base"
          />
        </SpiritualCardContent>
      </SpiritualCard>

      {/* AI Insights */}
      {note && note.trim().length > 20 && (
        <AIInsights 
          note={note}
          selectedItems={catalog.items.filter(item => isItemInEntry(item.id)).map(item => item.title)}
          type="reflection"
        />
      )}
    </div>
  );
}