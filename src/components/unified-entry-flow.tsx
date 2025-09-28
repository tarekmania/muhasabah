import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SpiritualCard, SpiritualCardHeader, SpiritualCardTitle, SpiritualCardContent } from '@/components/ui/spiritual-card';
import { ItemChip } from '@/components/ui/item-chip';
import { SelectedTray } from '@/components/ui/selected-tray';
import { SevereReflectionCard } from '@/components/reflection/severe-reflection-card';
import { MissedOpportunityCard } from '@/components/reflection/missed-opportunity-card';
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
    applyTemplate,
    updateItemUsage,
  } = useCatalog();

  const [activeTab, setActiveTab] = useState('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [note, setNote] = useState(existingEntry?.good?.note || existingEntry?.improve?.note || '');
  const [severeNote, setSevereNote] = useState(existingEntry?.severeSlip?.note || '');
  const [missedNote, setMissedNote] = useState(existingEntry?.missedOpportunity?.note || '');
  const [missedIntention, setMissedIntention] = useState(existingEntry?.missedOpportunity?.intention || '');
  const [dua, setDua] = useState(existingEntry?.dua || '');
  const [duaIndex, setDuaIndex] = useState(0);
  
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

  // Load existing entry data on mount
  useEffect(() => {
    if (existingEntry) {
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

      // Apply to selected state
      allItemIds.forEach(id => {
        addToSelected(id, combinedQty[id] || 1);
      });
    }
  }, [existingEntry, addToSelected]);

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

  const renderItemChip = (item: CatalogItem) => {
    let variant: 'good' | 'improve' | 'severe' | 'missed_opportunity' = 'good';
    if (item.type === 'IMPROVE') variant = 'improve';
    else if (item.type === 'SEVERE') variant = 'severe';
    else if (item.type === 'MISSED_OPPORTUNITY') variant = 'missed_opportunity';

    return (
      <ItemChip
        key={item.id}
        emoji={item.emoji}
        label={item.title}
        variant={variant}
        selected={selectedState.ids.includes(item.id)}
        usageCount={getItemUsageCount(item.id)}
        quantity={selectedState.qty[item.id]}
        onToggle={() => {
          if (selectedState.ids.includes(item.id)) {
            removeFromSelected(item.id);
          } else {
            addToSelected(item.id, 1);
          }
        }}
        onLongPress={() => handleLongPress(item)}
      />
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 pb-32">
      {/* Main Entry Interface */}
      <SpiritualCard variant="peaceful">
        <SpiritualCardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="explore" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Explore
              </TabsTrigger>
              <TabsTrigger value="search" className="gap-2">
                <Search className="h-4 w-4" />
                Search
              </TabsTrigger>
              <TabsTrigger value="templates" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Templates
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

            {/* Templates Tab */}
            <TabsContent value="templates" className="p-6 space-y-4">
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Curated Templates</h3>
                    <div className="grid gap-3">
                      {templatesWithCounts.map(template => (
                        <SpiritualCard key={template.id} variant="default" className="cursor-pointer hover:shadow-md transition-shadow">
                          <SpiritualCardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {template.emoji && <span className="text-2xl">{template.emoji}</span>}
                                <div>
                                  <h4 className="font-medium">{template.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {template.deedCount} deeds
                                    {template.usageCount > 0 && ` • Used ${template.usageCount} times`}
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => applyTemplate(template)}
                                variant="outline"
                              >
                                Apply
                              </Button>
                            </div>
                          </SpiritualCardContent>
                        </SpiritualCard>
                      ))}
                    </div>
                  </div>
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

      {/* Note Section */}
      <SpiritualCard variant="default">
        <SpiritualCardHeader>
          <SpiritualCardTitle>General Reflection Note</SpiritualCardTitle>
        </SpiritualCardHeader>
        <SpiritualCardContent>
          <Textarea
            placeholder="Any additional thoughts or reflections..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="resize-none"
            rows={3}
          />
        </SpiritualCardContent>
      </SpiritualCard>

      {/* Du'a Section */}
      <SpiritualCard variant="elevated">
        <SpiritualCardHeader>
          <SpiritualCardTitle>Tonight's Du'ā</SpiritualCardTitle>
        </SpiritualCardHeader>
        <SpiritualCardContent>
          <div className="space-y-3">
            <Textarea
              placeholder="Enter your du'ā for tonight..."
              value={dua}
              onChange={(e) => setDua(e.target.value)}
              className="resize-none font-serif text-base"
              rows={3}
              dir="rtl"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={suggestDua}
              className="self-start"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Suggest Du'ā
            </Button>
          </div>
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
        selectedState={selectedState}
        items={catalog.items}
        totalCount={totalSelected}
        onRemoveItem={removeFromSelected}
        onClear={clearSelected}
        onAddToToday={handleAddToToday}
      />
    </div>
  );
}