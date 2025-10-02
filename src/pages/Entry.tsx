import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Check, FileText, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { SpiritualCard, SpiritualCardContent, SpiritualCardHeader, SpiritualCardTitle } from '@/components/ui/spiritual-card';
import { UnifiedEntryFlow } from '@/components/unified-entry-flow';
import { DailyLedger } from '@/components/daily-ledger';
import { CalendarWidget } from '@/components/calendar-widget';
import { Badge } from '@/components/ui/badge';
import { Entry as EntryType, EntryStatus } from '@/types';
import { useCatalog } from '@/hooks/use-catalog';
import { toast } from '@/hooks/use-toast';

interface EntryPageProps {
  entries: EntryType[];
  onSave: (entry: Partial<EntryType>) => void;
  onUpdate: (entry: EntryType) => void;
}

export default function Entry({ entries, onSave, onUpdate }: EntryPageProps) {
  const navigate = useNavigate();
  const { date } = useParams<{ date?: string }>();
  const { catalog } = useCatalog();
  
  // Determine the date to work with
  const targetDate = date || format(new Date(), 'yyyy-MM-dd');
  // Parse date string properly to avoid timezone issues
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const [year, month, day] = targetDate.split('-').map(Number);
    return new Date(year, month - 1, day);
  });
  
  // Find existing entry for this date
  const existingEntry = useMemo(() => 
    entries.find(e => e.dateISO === targetDate),
    [entries, targetDate]
  );

  const handleSave = (entryData: Partial<EntryType>) => {
    if (existingEntry) {
      // Check if there are actual changes
      const hasChanges = JSON.stringify(existingEntry) !== JSON.stringify({ ...existingEntry, ...entryData });
      
      if (hasChanges) {
        // Update existing entry
        const updated: EntryType = {
          ...existingEntry,
          ...entryData,
          status: 'complete' as EntryStatus
        };
        onUpdate(updated);
        toast({
          title: "Entry Updated",
          description: `Your entry for ${format(selectedDate, 'MMMM d, yyyy')} has been updated.`,
          duration: 1000,
        });
      } else {
        // No changes, just update without toast
        const updated: EntryType = {
          ...existingEntry,
          ...entryData,
          status: 'complete' as EntryStatus
        };
        onUpdate(updated);
      }
    } else {
      // Create new entry
      const newEntry: Partial<EntryType> = {
        ...entryData,
        dateISO: targetDate,
        status: 'complete' as EntryStatus
      };
      onSave(newEntry);
      toast({
        title: "Entry Saved",
        description: `Your entry for ${format(selectedDate, 'MMMM d, yyyy')} has been saved.`,
        duration: 1000,
      });
    }
  };

  const handleQuantityChange = (itemId: string, type: 'good' | 'improve' | 'severe' | 'missed', newQuantity: number) => {
    if (!existingEntry) return;

    const updated = { ...existingEntry };
    
    if (type === 'good' && updated.good) {
      updated.good = {
        ...updated.good,
        qty: { ...updated.good.qty, [itemId]: newQuantity }
      };
    } else if (type === 'improve' && updated.improve) {
      updated.improve = {
        ...updated.improve,
        qty: { ...updated.improve.qty, [itemId]: newQuantity }
      };
    } else if (type === 'severe' && updated.severeSlip) {
      updated.severeSlip = {
        ...updated.severeSlip,
        qty: { ...updated.severeSlip.qty, [itemId]: newQuantity }
      };
    } else if (type === 'missed' && updated.missedOpportunity) {
      updated.missedOpportunity = {
        ...updated.missedOpportunity,
        qty: { ...updated.missedOpportunity.qty, [itemId]: newQuantity }
      };
    }

    onUpdate(updated);
    toast({
      title: "Quantity Updated",
      description: "Item quantity has been updated.",
      duration: 1000,
    });
  };

  const handleDateSelect = (date: Date) => {
    const dateISO = format(date, 'yyyy-MM-dd');
    setSelectedDate(date);
    navigate(`/entry/${dateISO}`);
  };

  const handleDateChange = (dateISO: string) => {
    navigate(`/entry/${dateISO}`);
  };

  const isToday = targetDate === format(new Date(), 'yyyy-MM-dd');
  const isPast = targetDate < format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="space-y-4 max-w-5xl mx-auto p-4 pb-32">
      {/* Date Selection */}
      <SpiritualCard variant="elevated">
        <SpiritualCardHeader>
          <SpiritualCardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-5 w-5" />
            {isToday ? 'Today\'s Journal' : isPast ? 'Past Journal' : 'Future Journal'}
          </SpiritualCardTitle>
        </SpiritualCardHeader>
        <SpiritualCardContent>
          <div className="space-y-3">
            <CalendarWidget
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              entries={entries}
            />
            <div className="flex items-center justify-between pt-3 border-t">
              <h3 className="font-semibold text-base">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h3>
              {existingEntry && (
                <Badge variant="outline" className="gap-1 text-sm px-2 py-1">
                  <Check className="h-4 w-4" />
                  {existingEntry.status || 'complete'}
                </Badge>
              )}
            </div>
          </div>
        </SpiritualCardContent>
      </SpiritualCard>

      {/* Daily Balance Sheet - Shown First */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <Scale className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-base font-medium text-muted-foreground">Spiritual Balance</h2>
        </div>
        <DailyLedger
          entry={existingEntry || null}
          catalogItems={catalog.items}
          date={targetDate}
          entries={entries}
          onDateChange={handleDateChange}
          onQuantityChange={handleQuantityChange}
        />
      </div>

      {/* Entry Form */}
      <UnifiedEntryFlow
        onSave={handleSave}
        existingEntry={existingEntry}
        targetDate={targetDate}
      />
    </div>
  );
}
