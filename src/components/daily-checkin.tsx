import React, { useState } from 'react';
import { TagChip } from '@/components/ui/tag-chip';
import { SpiritualCard, SpiritualCardHeader, SpiritualCardTitle, SpiritualCardContent, SpiritualCardFooter } from '@/components/ui/spiritual-card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sparkles, Heart, RefreshCw } from 'lucide-react';
import { seedTags, curated_duas, type Tag, type Entry } from '@/types';

interface DailyCheckinProps {
  onSave: (entry: Partial<Entry>) => void;
  existingEntry?: Entry | null;
}

export function DailyCheckin({ onSave, existingEntry }: DailyCheckinProps) {
  const [selectedGoodTags, setSelectedGoodTags] = useState<string[]>(
    existingEntry?.good?.tagIds || []
  );
  const [selectedImproveTags, setSelectedImproveTags] = useState<string[]>(
    existingEntry?.improve?.tagIds || []
  );
  const [goodNote, setGoodNote] = useState(existingEntry?.good?.note || '');
  const [improveNote, setImproveNote] = useState(existingEntry?.improve?.note || '');
  const [tawbah, setTawbah] = useState(existingEntry?.improve?.tawbah || false);
  const [dua, setDua] = useState(existingEntry?.dua || '');
  const [duaIndex, setDuaIndex] = useState(0);

  const goodTags = seedTags.filter(tag => tag.category === 'GOOD');
  const improveTags = seedTags.filter(tag => tag.category === 'IMPROVE');

  const toggleGoodTag = (tagId: string) => {
    setSelectedGoodTags(prev => 
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const toggleImproveTag = (tagId: string) => {
    setSelectedImproveTags(prev => 
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const suggestDua = () => {
    const nextIndex = (duaIndex + 1) % curated_duas.length;
    setDua(curated_duas[nextIndex]);
    setDuaIndex(nextIndex);
  };

  const handleSave = () => {
    const entry: Partial<Entry> = {
      dateISO: new Date().toISOString().split('T')[0],
      good: selectedGoodTags.length > 0 || goodNote ? {
        tagIds: selectedGoodTags,
        note: goodNote || undefined
      } : null,
      improve: selectedImproveTags.length > 0 || improveNote ? {
        tagIds: selectedImproveTags,
        note: improveNote || undefined,
        tawbah
      } : null,
      dua: dua || undefined
    };
    
    onSave(entry);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      {/* Good Deeds Section */}
      <SpiritualCard variant="peaceful">
        <SpiritualCardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <SpiritualCardTitle className="text-primary">Good I did today</SpiritualCardTitle>
          </div>
        </SpiritualCardHeader>
        <SpiritualCardContent>
          <div className="flex flex-wrap gap-2">
            {goodTags.map(tag => (
              <TagChip
                key={tag.id}
                label={tag.label}
                category="good"
                selected={selectedGoodTags.includes(tag.id)}
                onToggle={() => toggleGoodTag(tag.id)}
              />
            ))}
          </div>
          <Textarea
            placeholder="Any additional notes about good deeds..."
            value={goodNote}
            onChange={(e) => setGoodNote(e.target.value)}
            className="resize-none"
            rows={2}
          />
        </SpiritualCardContent>
      </SpiritualCard>

      {/* Areas to Improve Section */}
      <SpiritualCard variant="default">
        <SpiritualCardHeader>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-secondary" />
            <SpiritualCardTitle className="text-secondary-foreground">What to improve</SpiritualCardTitle>
          </div>
        </SpiritualCardHeader>
        <SpiritualCardContent>
          <div className="flex flex-wrap gap-2">
            {improveTags.map(tag => (
              <TagChip
                key={tag.id}
                label={tag.label}
                category="improve"
                selected={selectedImproveTags.includes(tag.id)}
                onToggle={() => toggleImproveTag(tag.id)}
              />
            ))}
          </div>
          <Textarea
            placeholder="Reflect on areas for improvement..."
            value={improveNote}
            onChange={(e) => setImproveNote(e.target.value)}
            className="resize-none"
            rows={2}
          />
          {(selectedImproveTags.length > 0 || improveNote) && (
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="tawbah"
                checked={tawbah}
                onCheckedChange={setTawbah}
              />
              <Label htmlFor="tawbah" className="text-sm">
                Mark Tawbah (Repentance)
              </Label>
            </div>
          )}
          {tawbah && (
            <div className="text-sm text-muted-foreground italic mt-2 p-3 bg-secondary/10 rounded-md">
              "Hope is near. Allah loves those who repent."
            </div>
          )}
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

      {/* Save Button */}
      <SpiritualCard variant="blessed">
        <SpiritualCardFooter className="justify-center">
          <Button 
            onClick={handleSave}
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-spiritual"
          >
            Save & Close
          </Button>
        </SpiritualCardFooter>
      </SpiritualCard>
    </div>
  );
}