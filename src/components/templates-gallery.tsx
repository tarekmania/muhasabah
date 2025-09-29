import React from 'react';
import { QuickTemplate, CatalogItem, UsageStats } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Users } from 'lucide-react';

interface TemplatesGalleryProps {
  templates: QuickTemplate[];
  catalogItems: CatalogItem[];
  usageStats: UsageStats;
  onApplyTemplate: (template: QuickTemplate) => void;
}

export function TemplatesGallery({
  templates,
  catalogItems,
  usageStats,
  onApplyTemplate
}: TemplatesGalleryProps) {
  const getTemplateWithStats = (template: QuickTemplate) => {
    const deedCount = template.good_item_ids.length + template.improve_item_ids.length;
    const usageCount = usageStats.templateUsage[template.id] || 0;
    
    return {
      ...template,
      deedCount,
      usageCount
    };
  };

  const getTemplateItems = (template: QuickTemplate) => {
    const allItemIds = [...template.good_item_ids, ...template.improve_item_ids];
    return allItemIds
      .map(id => catalogItems.find(item => item.id === id))
      .filter(Boolean) as CatalogItem[];
  };

  const getTemplateDescription = (template: QuickTemplate) => {
    const descriptions: Record<string, string> = {
      'morning-foundation': 'Start your day with essential morning practices',
      'post-salah-dhikr': 'Complete the canonical post-prayer remembrance',
      'family-mercy': 'Strengthen bonds with those closest to you',
      'work-with-ihsan': 'Bring excellence and mindfulness to your work',
      'jumah-boost': 'Special Friday spiritual elevation',
      'ramadan-day': 'Comprehensive Ramadan daily practice',
      'travel-kit': 'Essential dhikr and protection for journeys',
      'exams-focus': 'Spiritual preparation for important tests',
      'character-building': 'Develop beautiful Islamic character traits',
      'digital-balance': 'Mindful technology use and digital wellness'
    };
    
    return descriptions[template.id] || 'A curated collection of spiritual practices';
  };

  const sortedTemplates = templates
    .map(getTemplateWithStats)
    .sort((a, b) => {
      // Sort by usage count (most used first), then by deed count
      if (b.usageCount !== a.usageCount) {
        return b.usageCount - a.usageCount;
      }
      return (b.deedCount || 0) - (a.deedCount || 0);
    });

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-yellow-500" />
          Curated Templates
        </h2>
        <p className="text-muted-foreground">
          Pre-designed spiritual practice collections for different occasions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedTemplates.map((template) => {
          const items = getTemplateItems(template);
          const description = getTemplateDescription(template);
          
          return (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{template.emoji}</span>
                    <div>
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {description}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1 items-end">
                    <Badge variant="secondary" className="text-xs">
                      {template.deedCount} deeds
                    </Badge>
                    {template.usageCount > 0 && (
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {template.usageCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Preview of included items */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Includes:</p>
                  <div className="flex flex-wrap gap-1">
                    {items.slice(0, 6).map((item) => (
                      <div
                        key={item.id}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-xs"
                      >
                        <span>{item.emoji}</span>
                        <span>{item.title}</span>
                      </div>
                    ))}
                    {items.length > 6 && (
                      <div className="inline-flex items-center px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                        +{items.length - 6} more
                      </div>
                    )}
                  </div>
                </div>

                {/* Default dua preview */}
                {template.default_dua && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Default Du'a:</p>
                    <p className="text-sm bg-muted/50 p-2 rounded text-right font-arabic">
                      {template.default_dua}
                    </p>
                  </div>
                )}

                {/* Default note preview */}
                {template.default_note && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Note:</p>
                    <p className="text-sm bg-muted/50 p-2 rounded italic">
                      {template.default_note}
                    </p>
                  </div>
                )}

                {/* Apply button */}
                <Button
                  onClick={() => onApplyTemplate(template)}
                  className="w-full"
                  variant="outline"
                >
                  Apply Template
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="text-center text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
        <p>
          Templates are starting points for your spiritual practice. 
          Feel free to customize them according to your needs and circumstances.
        </p>
      </div>
    </div>
  );
}
