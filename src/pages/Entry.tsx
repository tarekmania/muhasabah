import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Check, FileText, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
      });
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
      });
    }
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
    <div className="space-y-4 max-w-5xl mx-auto p-4">
      {/* Date Selection */}
      <SpiritualCard variant="elevated">
        <SpiritualCardHeader>
          <SpiritualCardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            {isToday ? 'Today' : isPast ? 'Past Entry' : 'Future Entry'}
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
              <h3 className="font-semibold">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h3>
              {existingEntry && (
                <Badge variant="outline" className="gap-1">
                  <Check className="h-3 w-3" />
                  {existingEntry.status || 'complete'}
                </Badge>
              )}
            </div>
          </div>
        </SpiritualCardContent>
      </SpiritualCard>

      {/* Tabs for Entry & Balance Sheet */}
      <Tabs defaultValue="entry" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="entry" className="gap-2">
            <FileText className="h-4 w-4" />
            Entry
          </TabsTrigger>
          <TabsTrigger value="balance" className="gap-2">
            <Scale className="h-4 w-4" />
            Balance
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="entry" className="mt-4">
          <UnifiedEntryFlow
            onSave={handleSave}
            existingEntry={existingEntry}
          />
        </TabsContent>
        
        <TabsContent value="balance" className="mt-4">
          <DailyLedger
            entry={existingEntry || null}
            catalogItems={catalog.items}
            date={targetDate}
            entries={entries}
            onDateChange={handleDateChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
