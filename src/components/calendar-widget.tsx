import React from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Entry } from '@/types';

interface CalendarWidgetProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  entries: Entry[];
}

export function CalendarWidget({ selectedDate, onDateSelect, entries }: CalendarWidgetProps) {
  // Create a set of dates with entries for quick lookup
  const entriesDateSet = new Set(entries.map(e => e.dateISO));

  // Custom day modifier to show dates with entries
  const modifiers = {
    hasEntry: (date: Date) => {
      const dateISO = format(date, 'yyyy-MM-dd');
      return entriesDateSet.has(dateISO);
    }
  };

  const modifiersClassNames = {
    hasEntry: 'relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary'
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateSelect(date)}
          initialFocus
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          className="pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
}
