import React, { useState } from 'react';
import { SpiritualCard, SpiritualCardHeader, SpiritualCardTitle, SpiritualCardContent } from '@/components/ui/spiritual-card';
import { TagChip } from '@/components/ui/tag-chip';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Filter, CheckCircle2 } from 'lucide-react';
import { seedTags, type Entry, type Tag } from '@/types';

interface HistoryViewProps {
  entries: Entry[];
  onEditEntry: (entry: Entry) => void;
}

export function HistoryView({ entries, onEditEntry }: HistoryViewProps) {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const filteredEntries = selectedFilter 
    ? entries.filter(entry => 
        entry.good?.tagIds.includes(selectedFilter) || 
        entry.improve?.tagIds.includes(selectedFilter)
      )
    : entries;

  const allUsedTags = [...new Set([
    ...entries.flatMap(e => e.good?.tagIds || []),
    ...entries.flatMap(e => e.improve?.tagIds || [])
  ])];

  const filterTags = seedTags.filter(tag => allUsedTags.includes(tag.id));

  const formatDate = (dateISO: string) => {
    const date = new Date(dateISO);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getTagLabel = (tagId: string) => {
    return seedTags.find(tag => tag.id === tagId)?.label || tagId;
  };

  const getTagCategory = (tagId: string) => {
    return seedTags.find(tag => tag.id === tagId)?.category || 'GOOD';
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Your Journey</h2>
        <p className="text-muted-foreground">Reflect on your spiritual growth</p>
      </div>

      {/* Filter Section */}
      {filterTags.length > 0 && (
        <SpiritualCard variant="peaceful">
          <SpiritualCardHeader>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <SpiritualCardTitle className="text-sm">Filter by tag</SpiritualCardTitle>
            </div>
          </SpiritualCardHeader>
          <SpiritualCardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedFilter === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(null)}
              >
                All
              </Button>
              {filterTags.map(tag => (
                <TagChip
                  key={tag.id}
                  label={tag.label}
                  category={tag.category.toLowerCase() as 'good' | 'improve'}
                  selected={selectedFilter === tag.id}
                  onToggle={() => setSelectedFilter(
                    selectedFilter === tag.id ? null : tag.id
                  )}
                />
              ))}
            </div>
          </SpiritualCardContent>
        </SpiritualCard>
      )}

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <SpiritualCard>
            <SpiritualCardContent className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {selectedFilter ? 'No entries found for this filter' : 'No entries yet. Start your journey today!'}
              </p>
            </SpiritualCardContent>
          </SpiritualCard>
        ) : (
          filteredEntries.map(entry => (
            <SpiritualCard key={entry.id} variant="default" className="cursor-pointer hover:shadow-spiritual transition-all">
              <SpiritualCardContent onClick={() => onEditEntry(entry)}>
                <div className="space-y-4">
                  {/* Date Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{formatDate(entry.dateISO)}</h3>
                    {entry.improve?.tawbah && (
                      <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Tawbah
                      </Badge>
                    )}
                  </div>

                  {/* Good Deeds */}
                  {entry.good && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-primary">Good deeds</h4>
                      <div className="flex flex-wrap gap-1">
                        {entry.good.tagIds.map(tagId => (
                          <TagChip
                            key={tagId}
                            label={getTagLabel(tagId)}
                            category="good"
                            selected={true}
                            className="text-xs py-1 px-2"
                          />
                        ))}
                      </div>
                      {entry.good.note && (
                        <p className="text-sm text-muted-foreground italic">"{entry.good.note}"</p>
                      )}
                    </div>
                  )}

                  {/* Areas to Improve */}
                  {entry.improve && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-secondary-foreground">Areas to improve</h4>
                      <div className="flex flex-wrap gap-1">
                        {entry.improve.tagIds.map(tagId => (
                          <TagChip
                            key={tagId}
                            label={getTagLabel(tagId)}
                            category="improve"
                            selected={true}
                            className="text-xs py-1 px-2"
                          />
                        ))}
                      </div>
                      {entry.improve.note && (
                        <p className="text-sm text-muted-foreground italic">"{entry.improve.note}"</p>
                      )}
                    </div>
                  )}

                  {/* Du'a */}
                  {entry.dua && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Du'ā</h4>
                      <p className="text-sm text-muted-foreground font-serif" dir="rtl">
                        {entry.dua}
                      </p>
                    </div>
                  )}
                </div>
              </SpiritualCardContent>
            </SpiritualCard>
          ))
        )}
      </div>
    </div>
  );
}