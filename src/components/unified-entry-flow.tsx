import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { SpiritualCard, SpiritualCardHeader, SpiritualCardTitle, SpiritualCardContent } from '@/components/ui/spiritual-card';
import { EnhancedItemChip } from '@/components/ui/enhanced-item-chip';
import { SelectedTray } from '@/components/ui/selected-tray';
import { QuantitySelector } from '@/components/reflection/quantity-selector';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, Heart, ChevronDown } from 'lucide-react';
import { useCatalog } from '@/hooks/use-catalog';
import { curated_duas, type Entry, type CatalogItem } from '@/types';
import { cn } from '@/lib/utils';

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
  
  // Quantity selector state
  const [quantitySelector, setQuantitySelector] = useState<{
    isOpen: boolean;
    itemId: string;
    itemTitle: string;
    itemEmoji?: string;
    currentQuantity: number;
  }>({
    isOpen: false,
    itemId: '',
    itemTitle: '',
    currentQuantity: 1,
  });

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

  const suggestDua = () => {
    const nextIndex = (duaIndex + 1) % curated_duas.length;
    setDua(curated_duas[nextIndex]);
    setDuaIndex(nextIndex);
  };

  const handleLongPress = (item: CatalogItem) => {
    setQuantitySelector({
      isOpen: true,
      itemId: item.id,
      itemTitle: item.title,
      itemEmoji: item.emoji,
      currentQuantity: selectedState.qty[item.id] || 1,
    });
  };

  const handleQuantityConfirm = (quantity: number) => {
    addToSelected(quantitySelector.itemId, quantity - (selectedState.qty[quantitySelector.itemId] || 0));
  };

  const handleAddToToday = () => {
    if (totalSelected === 0) return;

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

  const handleCountChange = (itemId: string, newCount: number) => {
    if (newCount <= 0) {
      removeFromSelected(itemId);
    } else {
      const currentCount = selectedState.qty[itemId] || 0;
      const difference = newCount - currentCount;
      addToSelected(itemId, difference);
    }
  };

  const renderItemChip = (item: CatalogItem) => {
    return (
      <EnhancedItemChip
        key={item.id}
        item={item}
        count={selectedState.qty[item.id] || 0}
        onCountChange={handleCountChange}
        usageCount={getItemUsageCount(item.id)}
        isSelected={selectedState.ids.includes(item.id)}
      />
    );
  };

  return (
    <div className="space-y-4">
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
                      <div className="flex flex-wrap gap-2">
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
                          <div className="flex flex-wrap gap-2">
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
                          <div className="flex flex-wrap gap-2">
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
                          <div className="flex flex-wrap gap-2">
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
                          <div className="flex flex-wrap gap-2">
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

      {/* Quantity Selector Modal */}
      <QuantitySelector
        isOpen={quantitySelector.isOpen}
        onClose={() => setQuantitySelector(prev => ({ ...prev, isOpen: false }))}
        itemTitle={quantitySelector.itemTitle}
        itemEmoji={quantitySelector.itemEmoji}
        currentQuantity={quantitySelector.currentQuantity}
        onQuantityChange={(quantity) => setQuantitySelector(prev => ({ ...prev, currentQuantity: quantity }))}
        onConfirm={handleQuantityConfirm}
      />

      {/* Selected Tray */}
      <SelectedTray
        selectedItems={catalog.items.filter(item => selectedState.ids.includes(item.id))}
        selectedState={selectedState}
        onCountChange={handleCountChange}
        onRemoveItem={removeFromSelected}
        onSaveToday={handleAddToToday}
        onClear={clearSelected}
        isVisible={totalSelected > 0}
      />
    </div>
  );
}