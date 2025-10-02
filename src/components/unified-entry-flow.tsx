import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { SpiritualCard, SpiritualCardHeader, SpiritualCardTitle, SpiritualCardContent } from '@/components/ui/spiritual-card';
import { ItemChip } from '@/components/ui/item-chip';
import { SelectedTray } from '@/components/ui/selected-tray';
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
}

export function UnifiedEntryFlow({ onSave, existingEntry }: UnifiedEntryFlowProps) {
  const {
    catalog,
    categoryCounts,
    templatesWithCounts,
    selectedState,
    totalSelected,
    getItemUsageCount,
    searchItems,
    getItemsByCategory,
    getFeaturedItems,
    addToSelected,
    removeFromSelected,
    clearSelected,
    setSelected,
    applyTemplate,
    updateItemUsage,
  } = useCatalog();

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [note, setNote] = useState(existingEntry?.good?.note || existingEntry?.improve?.note || '');
  const [dua, setDua] = useState(existingEntry?.dua || '');
  const [duaIndex, setDuaIndex] = useState(0);
  
  // Track the last hydrated entry to prevent re-hydration
  const lastHydratedEntryId = useRef<string | null>(null);

  // Load existing entry data on mount (idempotent)
  useEffect(() => {
    if (existingEntry && existingEntry.id !== lastHydratedEntryId.current) {
      // Clear existing selection first to prevent accumulation
      setSelected({ ids: [], qty: {} });
      
      // Pre-select items from existing entry
      const allItemIds = [
        ...(existingEntry.good?.itemIds || []),
        ...(existingEntry.improve?.itemIds || []),
        ...(existingEntry.severeSlip?.itemIds || []),
        ...(existingEntry.missedOpportunity?.itemIds || []),
      ];
      
      const combinedQty = {
        ...(existingEntry.good?.qty || {}),
        ...(existingEntry.improve?.qty || {}),
        ...(existingEntry.severeSlip?.qty || {}),
        ...(existingEntry.missedOpportunity?.qty || {}),
      };

      // Set the complete state atomically
      if (allItemIds.length > 0) {
        setSelected({
          ids: [...new Set(allItemIds)],
          qty: combinedQty
        });
      }
      
      // Mark this entry as hydrated
      lastHydratedEntryId.current = existingEntry.id;
    }
  }, [existingEntry?.id, setSelected]);

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

  const handleItemToggle = (item: CatalogItem) => {
    const isSelected = selectedState.ids.includes(item.id);
    if (isSelected) {
      removeFromSelected(item.id);
    } else {
      addToSelected(item.id, 1); // Default quantity of 1
    }
  };

  const handleAddToToday = () => {
    if (totalSelected === 0) return;

    // Track last used timestamp for recently used feature
    selectedState.ids.forEach(id => {
      localStorage.setItem(`lastUsed_${id}`, Date.now().toString());
    });

    const goodItemIds = selectedState.ids.filter(id => 
      goodItems.find(item => item.id === id)
    );
    const improveItemIds = selectedState.ids.filter(id => 
      improveItems.find(item => item.id === id)
    );
    const severeItemIds = selectedState.ids.filter(id => 
      severeItems.find(item => item.id === id)
    );
    const missedOpportunityItemIds = selectedState.ids.filter(id => 
      missedOpportunityItems.find(item => item.id === id)
    );

    const entry: Partial<Entry> = {
      dateISO: new Date().toISOString().split('T')[0],
      good: goodItemIds.length > 0 ? {
        itemIds: goodItemIds,
        note: note || undefined,
        qty: selectedState.qty
      } : null,
      improve: improveItemIds.length > 0 ? {
        itemIds: improveItemIds,
        note: note || undefined,
        qty: selectedState.qty
      } : null,
      severeSlip: severeItemIds.length > 0 ? {
        itemIds: severeItemIds,
        note: note || undefined,
        tawbah: true,
        qty: selectedState.qty
      } : null,
      missedOpportunity: missedOpportunityItemIds.length > 0 ? {
        itemIds: missedOpportunityItemIds,
        note: note || undefined,
        intention: undefined,
        qty: selectedState.qty
      } : null,
      dua: dua || undefined,
      privacy_level: severeItemIds.length > 0 ? 'highly_sensitive' : 'normal'
    };

    // Update usage stats
    updateItemUsage(selectedState.ids);
    
    onSave(entry);
    clearSelected();
  };

  const renderItemChip = (item: CatalogItem) => {
    const isSelected = selectedState.ids.includes(item.id);
    const count = selectedState.qty[item.id] || 0;
    
    return (
      <ItemChip
        key={item.id}
        emoji={item.emoji}
        label={item.title}
        variant={item.type.toLowerCase() as any}
        selected={isSelected}
        quantity={count}
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
          selectedItems={catalog.items.filter(item => selectedState.ids.includes(item.id)).map(item => item.title)}
          type="reflection"
        />
      )}

      {/* Selected Tray */}
      <SelectedTray
        selectedItems={catalog.items.filter(item => selectedState.ids.includes(item.id))}
        selectedState={selectedState}
        onCountChange={() => {}}
        onRemoveItem={removeFromSelected}
        onSaveToday={handleAddToToday}
        onClear={clearSelected}
        isVisible={totalSelected > 0}
      />
    </div>
  );
}