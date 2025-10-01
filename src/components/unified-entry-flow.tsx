import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SpiritualCard, SpiritualCardHeader, SpiritualCardTitle, SpiritualCardContent } from '@/components/ui/spiritual-card';
import { EnhancedItemChip } from '@/components/ui/enhanced-item-chip';
import { SelectedTray } from '@/components/ui/selected-tray';
import { SevereReflectionCard } from '@/components/reflection/severe-reflection-card';
import { MissedOpportunityCard } from '@/components/reflection/missed-opportunity-card';
import { GuidedReflectionCard } from '@/components/reflection/guided-reflection-card';
import { QuantitySelector } from '@/components/reflection/quantity-selector';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Sparkles, BookOpen, RefreshCw, Heart, Shield, Lightbulb } from 'lucide-react';
import { useCatalog } from '@/hooks/use-catalog';
import { curated_duas, type Entry, type CatalogItem } from '@/types';

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

  const [activeTab, setActiveTab] = useState('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [note, setNote] = useState(existingEntry?.good?.note || existingEntry?.improve?.note || '');
  const [severeNote, setSevereNote] = useState(existingEntry?.severeSlip?.note || '');
  const [missedNote, setMissedNote] = useState(existingEntry?.missedOpportunity?.note || '');
  const [missedIntention, setMissedIntention] = useState(existingEntry?.missedOpportunity?.intention || '');
  const [mood, setMood] = useState<'struggling' | 'stable' | 'growing' | 'thriving' | undefined>();
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
        note: severeNote || undefined,
        tawbah: true, // Always true for severe items
        qty: selectedState.qty
      } : null,
      missedOpportunity: missedOpportunityItemIds.length > 0 ? {
        itemIds: missedOpportunityItemIds,
        note: missedNote || undefined,
        intention: missedIntention || undefined,
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
    <div className="space-y-6 max-w-4xl mx-auto p-4 pb-32">
      {/* Main Entry Interface */}
      <SpiritualCard variant="peaceful">
        <SpiritualCardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="explore" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Explore
              </TabsTrigger>
              <TabsTrigger value="search" className="gap-2">
                <Search className="h-4 w-4" />
                Search
              </TabsTrigger>
            </TabsList>

            {/* Explore Tab */}
            <TabsContent value="explore" className="p-6 space-y-6">
              <ScrollArea className="h-[500px]">
                <Accordion type="multiple" className="w-full">
                  {catalog.categories.map(category => {
                    const categoryItems = catalog.items.filter(item => item.category_id === category.id);
                    const goodCategoryItems = categoryItems.filter(item => item.type === 'GOOD');
                    const improveCategoryItems = categoryItems.filter(item => item.type === 'IMPROVE');
                    
                    return (
                      <AccordionItem key={category.id} value={category.id}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center gap-2">
                            {category.emoji && <span>{category.emoji}</span>}
                            <span>{category.title}</span>
                            <span className="text-sm text-muted-foreground">
                              ({categoryCounts[category.id] || 0})
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-2">
                            {/* Good items */}
                            {goodCategoryItems.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium mb-2 text-primary flex items-center gap-1">
                                  <Heart className="h-3 w-3" />
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
                                  <Sparkles className="h-3 w-3" />
                                  Areas to improve
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {improveCategoryItems.map(renderItemChip)}
                                </div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </ScrollArea>
            </TabsContent>

            {/* Search Tab */}
            <TabsContent value="search" className="p-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Search deeds and actions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {searchResults.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {searchResults.map(renderItemChip)}
                    </div>
                  ) : searchQuery ? (
                    <div className="text-center text-muted-foreground py-8">
                      No items found for "{searchQuery}"
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      Type to search for deeds and actions
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

          </Tabs>
        </SpiritualCardContent>
      </SpiritualCard>

      {/* Severe Reflection Section */}
      <SevereReflectionCard
        severeItems={severeItems}
        selectedState={selectedState}
        note={severeNote}
        onNoteChange={setSevereNote}
        onItemToggle={(itemId) => {
          if (selectedState.ids.includes(itemId)) {
            removeFromSelected(itemId);
          } else {
            addToSelected(itemId, 1);
          }
        }}
        getItemUsageCount={getItemUsageCount}
      />

      {/* Missed Opportunity Section */}
      <MissedOpportunityCard
        missedOpportunityItems={missedOpportunityItems}
        selectedState={selectedState}
        note={missedNote}
        intention={missedIntention}
        onNoteChange={setMissedNote}
        onIntentionChange={setMissedIntention}
        onItemToggle={(itemId) => {
          if (selectedState.ids.includes(itemId)) {
            removeFromSelected(itemId);
          } else {
            addToSelected(itemId, 1);
          }
        }}
        getItemUsageCount={getItemUsageCount}
      />

      {/* Guided Reflection Section */}
      <GuidedReflectionCard
        note={note}
        onNoteChange={setNote}
        mood={mood}
        onMoodChange={setMood}
        hasSelectedItems={totalSelected > 0}
      />

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
