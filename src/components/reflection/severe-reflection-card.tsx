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
}

const tawbahGuidance = [
  "Remember: Allah's mercy encompasses all things. Turn to Him with sincere repentance.",
  "The Prophet ﷺ said: 'All the sons of Adam are sinners, but the best of sinners are those who repent.'",
  "Allah says: 'And whoever repents and does righteous deeds - then Allah will accept his repentance.'",
  "Make istighfar, seek forgiveness, and resolve never to return to this action.",
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
                <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
                  {tawbahGuidance[currentGuidance]}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={nextGuidance}
                  className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-400"
                >
                  Next Guidance
                </Button>
              </div>
            )}
          </>
        )}
      </SpiritualCardContent>
    </SpiritualCard>
  );
}