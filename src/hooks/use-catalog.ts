import { useState, useEffect, useMemo } from 'react';
import { seedCatalog, type Catalog, type CatalogItem, type QuickTemplate, type SelectedState, type UsageStats } from '@/types';

const USAGE_STORAGE_KEY = 'muhasabah_usage_stats';

export function useCatalog() {
  const [catalog] = useState<Catalog>(seedCatalog);
  const [usageStats, setUsageStats] = useState<UsageStats>({ itemUsage: {}, templateUsage: {} });
  const [selectedState, setSelectedState] = useState<SelectedState>({ ids: [], qty: {} });

  // Load usage stats on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(USAGE_STORAGE_KEY);
      if (saved) {
        setUsageStats(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load usage stats:', error);
    }
  }, []);

  // Derived data with counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    catalog.categories.forEach(cat => counts[cat.id] = 0);
    catalog.items.forEach(item => {
      counts[item.category_id] = (counts[item.category_id] || 0) + 1;
    });
    return counts;
  }, [catalog]);

  const templatesWithCounts = useMemo(() => {
    return catalog.templates.map(template => ({
      ...template,
      deedCount: (template.good_item_ids?.length || 0) + (template.improve_item_ids?.length || 0),
      usageCount: usageStats.templateUsage[template.id] || 0
    }));
  }, [catalog.templates, usageStats.templateUsage]);

  // Helper functions
  const getItemUsageCount = (itemId: string) => usageStats.itemUsage[itemId] || 0;

  const searchItems = (query: string): CatalogItem[] => {
    if (!query.trim()) return [];
    const lowercaseQuery = query.toLowerCase();
    return catalog.items.filter(item => 
      item.title.toLowerCase().includes(lowercaseQuery) ||
      item.aliases?.some(alias => alias.toLowerCase().includes(lowercaseQuery))
    );
  };

  const getItemsByCategory = (categoryId: string) => 
    catalog.items.filter(item => item.category_id === categoryId);

  const getFeaturedItems = (categoryId: string, limit = 5) => 
    getItemsByCategory(categoryId)
      .sort((a, b) => getItemUsageCount(b.id) - getItemUsageCount(a.id))
      .slice(0, limit);

  // Selected state management
  const addToSelected = (itemId: string, quantity = 1) => {
    setSelectedState(prev => {
      const newIds = prev.ids.includes(itemId) ? prev.ids : [...prev.ids, itemId];
      const newQty = { ...prev.qty, [itemId]: (prev.qty[itemId] || 0) + quantity };
      return { ids: newIds, qty: newQty };
    });
  };

  const removeFromSelected = (itemId: string) => {
    setSelectedState(prev => {
      const newIds = prev.ids.filter(id => id !== itemId);
      const { [itemId]: _, ...newQty } = prev.qty;
      return { ids: newIds, qty: newQty };
    });
  };

  const clearSelected = () => {
    setSelectedState({ ids: [], qty: {} });
  };

  const applyTemplate = (template: QuickTemplate) => {
    const allIds = [...(template.good_item_ids || []), ...(template.improve_item_ids || [])];
    setSelectedState(prev => {
      const newIds = [...new Set([...prev.ids, ...allIds])];
      const newQty = { ...prev.qty };
      allIds.forEach(id => {
        newQty[id] = (newQty[id] || 0) + 1;
      });
      return { ids: newIds, qty: newQty };
    });
    
    // Update template usage
    setUsageStats(prev => {
      const updated = {
        ...prev,
        templateUsage: {
          ...prev.templateUsage,
          [template.id]: (prev.templateUsage[template.id] || 0) + 1
        }
      };
      localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const updateItemUsage = (itemIds: string[]) => {
    setUsageStats(prev => {
      const updated = { ...prev };
      itemIds.forEach(id => {
        updated.itemUsage[id] = (updated.itemUsage[id] || 0) + 1;
      });
      localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const totalSelected = selectedState.ids.reduce((acc, id) => acc + (selectedState.qty[id] || 1), 0);

  return {
    catalog,
    categoryCounts,
    templatesWithCounts,
    usageStats,
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
  };
}