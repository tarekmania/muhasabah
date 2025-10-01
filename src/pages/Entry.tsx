import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Check, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SpiritualCard, SpiritualCardContent, SpiritualCardHeader, SpiritualCardTitle } from '@/components/ui/spiritual-card';
import { UnifiedEntryFlow } from '@/components/unified-entry-flow';
import { CalendarWidget } from '@/components/calendar-widget';
import { Badge } from '@/components/ui/badge';
import { Entry as EntryType, EntryStatus } from '@/types';
import { toast } from '@/hooks/use-toast';

interface EntryPageProps {
  entries: EntryType[];
  onSave: (entry: Partial<EntryType>) => void;
  onUpdate: (entry: EntryType) => void;
}

export default function Entry({ entries, onSave, onUpdate }: EntryPageProps) {
  const navigate = useNavigate();
  const { date } = useParams<{ date?: string }>();
  
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
    
    navigate('/');
  };

  const handleDateSelect = (date: Date) => {
    const dateISO = format(date, 'yyyy-MM-dd');
    setSelectedDate(date);
    navigate(`/entry/${dateISO}`);
  };

  const isToday = targetDate === format(new Date(), 'yyyy-MM-dd');
  const isPast = targetDate < format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="flex items-center gap-2">
          {existingEntry && (
            <Badge variant="outline" className="gap-1">
              <Check className="h-3 w-3" />
              {existingEntry.status || 'complete'}
            </Badge>
          )}
        </div>
      </div>

      {/* Date Selection & Context */}
      <SpiritualCard variant="elevated">
        <SpiritualCardHeader>
          <SpiritualCardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {isToday ? 'Today\'s Entry' : isPast ? 'Past Entry' : 'Future Entry'}
          </SpiritualCardTitle>
        </SpiritualCardHeader>
        <SpiritualCardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Select date to edit:</p>
              <CalendarWidget
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                entries={entries}
              />
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="font-semibold text-lg mb-1">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {existingEntry 
                  ? 'Edit your existing entry or add more reflections'
                  : 'Create a new entry for this date'
                }
              </p>
            </div>
          </div>
        </SpiritualCardContent>
      </SpiritualCard>

      {/* Entry Flow */}
      <UnifiedEntryFlow
        onSave={handleSave}
        existingEntry={existingEntry}
      />
    </div>
  );
}
