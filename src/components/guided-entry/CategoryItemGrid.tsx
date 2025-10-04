import React, { useMemo } from 'react';
import { ItemChip } from '@/components/ui/item-chip';
import { CatalogItem } from '@/types';
import { getCurrentTimeContext } from '@/types/guided-entry';
import { useCatalog } from '@/hooks/use-catalog';

interface CategoryItemGridProps {
  categoryIds: string[];
  selectedItems: Record<string, number>;
  onItemToggle: (item: CatalogItem) => void;
  onQuantityChange?: (itemId: string, quantity: number) => void;
  itemType?: 'GOOD' | 'IMPROVE' | 'SEVERE' | 'MISSED_OPPORTUNITY' | 'all';
  showRecentFirst?: boolean;
}

export function CategoryItemGrid({
  categoryIds,
  selectedItems,
  onItemToggle,
  onQuantityChange,
  itemType = 'all',
  showRecentFirst = true,
}: CategoryItemGridProps) {
  const { catalog, getItemUsageCount } = useCatalog();
  const timeContext = getCurrentTimeContext();

  const filteredItems = useMemo(() => {
    let items = catalog.items.filter(item => 
      categoryIds.includes(item.category_id) &&
      (itemType === 'all' || item.type === itemType)
    );

    // Time-aware filtering for specific items
    if (timeContext === 'morning' || timeContext === 'afternoon') {
      // Prioritize morning adhkar in morning/afternoon
      items = items.sort((a, b) => {
        if (a.id.includes('morning') && !b.id.includes('morning')) return -1;
        if (!a.id.includes('morning') && b.id.includes('morning')) return 1;
        return 0;
      });
    } else if (timeContext === 'evening' || timeContext === 'night') {
      // Prioritize evening adhkar in evening/night
      items = items.sort((a, b) => {
        if (a.id.includes('evening') && !b.id.includes('evening')) return -1;
        if (!a.id.includes('evening') && b.id.includes('evening')) return 1;
        return 0;
      });
    }

    // Sort by usage if requested
    if (showRecentFirst) {
      items = items.sort((a, b) => {
        const aUsage = getItemUsageCount(a.id);
        const bUsage = getItemUsageCount(b.id);
        return bUsage - aUsage;
      });
    }

    return items;
  }, [catalog.items, categoryIds, itemType, timeContext, showRecentFirst, getItemUsageCount]);

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No items in this category yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2">
      {filteredItems.map((item) => (
        <ItemChip
          key={item.id}
          emoji={item.emoji}
          label={item.title}
          variant={item.type.toLowerCase() as any}
          selected={!!selectedItems[item.id]}
          quantity={selectedItems[item.id]}
          usageCount={getItemUsageCount(item.id)}
          onToggle={() => onItemToggle(item)}
          size="default"
          className="min-h-[48px]"
        />
      ))}
    </div>
  );
}
