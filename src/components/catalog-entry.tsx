import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SpiritualCard, SpiritualCardHeader, SpiritualCardTitle, SpiritualCardContent } from '@/components/ui/spiritual-card';
import { ItemChip } from '@/components/ui/item-chip';
import { SelectedTray } from '@/components/ui/selected-tray';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Sparkles, BookOpen, RefreshCw } from 'lucide-react';
import { useCatalog } from '@/hooks/use-catalog';
import { curated_duas, type Entry, type CatalogItem } from '@/types';

interface CatalogEntryProps {
  onSave: (entry: Partial<Entry>) => void;
  existingEntry?: Entry | null;
}

export function CatalogEntry({ onSave, existingEntry }: CatalogEntryProps) {
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
  const [dua, setDua] = useState(existingEntry?.dua || '');
  const [duaIndex, setDuaIndex] = useState(0);

  // Search results
  const searchResults = searchQuery ? searchItems(searchQuery) : [];

  const suggestDua = () => {
    const nextIndex = (duaIndex + 1) % curated_duas.length;
    setDua(curated_duas[nextIndex]);
    setDuaIndex(nextIndex);
  };

  const handleAddToToday = () => {
    if (totalSelected === 0) return;

    const goodItems = selectedState.ids.filter(id => 
      catalog.items.find(item => item.id === id)?.type === 'GOOD'
    );
    const improveItems = selectedState.ids.filter(id => 
      catalog.items.find(item => item.id === id)?.type === 'IMPROVE'
    );

    const entry: Partial<Entry> = {
      dateISO: new Date().toISOString().split('T')[0],
      good: goodItems.length > 0 ? {
        itemIds: goodItems,
        note: note || undefined,
        qty: selectedState.qty
      } : null,
      improve: improveItems.length > 0 ? {
        itemIds: improveItems,
        note: note || undefined,
        qty: selectedState.qty
      } : null,
      dua: dua || undefined
    };

    // Update usage stats
    updateItemUsage(selectedState.ids);
    
    onSave(entry);
    clearSelected();
  };

  const renderItemChip = (item: CatalogItem) => (
    <ItemChip
      key={item.id}
      emoji={item.emoji}
      label={item.title}
      variant={item.type === 'GOOD' ? 'good' : 'improve'}
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
      onLongPress={() => {
        // TODO: Open quantity selector
        addToSelected(item.id, 5);
      }}
    />
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 pb-32">
      {/* Tabbed Interface */}
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
                  {catalog.categories.map(category => (
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
                          {/* Featured items */}
                          <div>
                            <h4 className="text-sm font-medium mb-2 text-muted-foreground">Featured</h4>
                            <div className="flex flex-wrap gap-2">
                              {getFeaturedItems(category.id, 4).map(renderItemChip)}
                            </div>
                          </div>
                          
                          {/* All items */}
                          <div>
                            <h4 className="text-sm font-medium mb-2 text-muted-foreground">All items</h4>
                            <div className="flex flex-wrap gap-2">
                              {getItemsByCategory(category.id).map(renderItemChip)}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            </TabsContent>

            {/* Search Tab */}
            <TabsContent value="search" className="p-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search deeds and actions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
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

      {/* Note Section */}
      <SpiritualCard variant="default">
        <SpiritualCardHeader>
          <SpiritualCardTitle>Reflection Note</SpiritualCardTitle>
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