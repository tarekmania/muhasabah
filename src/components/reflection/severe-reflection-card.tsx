import React, { useState } from 'react';
import { SpiritualCard, SpiritualCardHeader, SpiritualCardTitle, SpiritualCardContent } from '@/components/ui/spiritual-card';
import { ItemChip } from '@/components/ui/item-chip';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Shield, Heart } from 'lucide-react';
import { type CatalogItem, type SelectedState } from '@/types';

interface SevereReflectionCardProps {
  severeItems: CatalogItem[];
  selectedState: SelectedState;
  note: string;
  onNoteChange: (note: string) => void;
  onItemToggle: (itemId: string) => void;
  getItemUsageCount: (itemId: string) => number;
  severity?: 'light' | 'moderate' | 'severe';
  onSeverityChange?: (itemId: string, severity: 'light' | 'moderate' | 'severe') => void;
}

const tawbahGuidance = [
  {
    verse: "Indeed, Allah loves those who are constantly repentant. (Quran 2:222)",
    action: "Make sincere Tawbah immediately",
    steps: ["1. Stop the sin immediately", "2. Feel genuine remorse", "3. Commit to never return"]
  },
  {
    verse: "Say, 'O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins.' (Quran 39:53)",
    action: "Never lose hope in Allah's mercy",
    steps: ["1. Recognize Allah's infinite mercy", "2. Make sincere du'a", "3. Increase good deeds"]
  },
  {
    verse: "And turn to Allah in repentance, all of you, that you might succeed. (Quran 24:31)",
    action: "Return to Allah with humility",
    steps: ["1. Pray two rak'ahs of Tawbah", "2. Make istighfar abundantly", "3. Seek forgiveness at night"]
  },
  {
    verse: "Indeed, good deeds do away with misdeeds. (Quran 11:114)",
    action: "Follow bad deeds with good deeds",
    steps: ["1. Perform extra prayers", "2. Give charity", "3. Help someone in need"]
  }
];

export function SevereReflectionCard({
  severeItems,
  selectedState,
  note,
  onNoteChange,
  onItemToggle,
  getItemUsageCount,
}: SevereReflectionCardProps) {
  const [showGuidance, setShowGuidance] = useState(false);
  const [currentGuidance, setCurrentGuidance] = useState(0);

  const hasSevereSelected = severeItems.some(item => selectedState.ids.includes(item.id));

  const nextGuidance = () => {
    setCurrentGuidance((prev) => (prev + 1) % tawbahGuidance.length);
  };

  const currentGuidanceData = tawbahGuidance[currentGuidance];

  return (
    <SpiritualCard variant="default" className="border-red-200 dark:border-red-900">
      <SpiritualCardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-600" />
          <SpiritualCardTitle className="text-red-700 dark:text-red-400">
            Serious Reflection & Tawbah
          </SpiritualCardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          For matters requiring immediate repentance and spiritual attention
        </p>
      </SpiritualCardHeader>
      <SpiritualCardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {severeItems.map(item => (
            <AlertDialog key={item.id}>
              <AlertDialogTrigger asChild>
                <div>
                  <ItemChip
                    emoji={item.emoji}
                    label={item.title}
                    variant="severe"
                    selected={selectedState.ids.includes(item.id)}
                    usageCount={getItemUsageCount(item.id)}
                    quantity={selectedState.qty[item.id]}
                    onToggle={() => {}} // Handled by dialog
                    onLongPress={() => {}}
                  />
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-600" />
                    Confirming Serious Matter
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    You're about to log a serious spiritual matter. This will be marked for tawbah 
                    and stored with enhanced privacy. Are you sure you want to continue?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => {
                      onItemToggle(item.id);
                      setShowGuidance(true);
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Yes, Log for Tawbah
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ))}
        </div>

        {hasSevereSelected && (
          <>
            <Textarea
              placeholder="Private reflection on this matter... (This is stored with enhanced privacy)"
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              className="resize-none border-red-200 dark:border-red-900"
              rows={3}
            />

            {showGuidance && (
              <div className="space-y-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-600" />
                  <h4 className="font-medium text-red-700 dark:text-red-400">Guidance for Tawbah</h4>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed italic mb-2">
                  {currentGuidanceData.verse}
                </p>
                <div className="bg-background/60 rounded p-3 space-y-2">
                  <p className="text-sm font-medium">{currentGuidanceData.action}</p>
                  <div className="space-y-1">
                    {currentGuidanceData.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="text-red-500">•</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={nextGuidance}
                  className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-400 w-full"
                >
                  Next Guidance →
                </Button>
              </div>
            )}
          </>
        )}
      </SpiritualCardContent>
    </SpiritualCard>
  );
}