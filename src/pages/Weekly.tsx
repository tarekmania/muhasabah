import React, { useMemo } from 'react';
import { WeeklyReview } from '@/components/weekly-review';
import { Entry } from '@/types';
import { useCatalog } from '@/hooks/use-catalog';

interface WeeklyProps {
  entries: Entry[];
  onSaveIntention: (intention: string) => void;
}

export default function Weekly({ entries, onSaveIntention }: WeeklyProps) {
  const { catalog } = useCatalog();

  // Calculate current week range
  const weekRange = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return {
      start: weekStart.toISOString().split('T')[0],
      end: weekEnd.toISOString().split('T')[0]
    };
  }, []);

  // Filter entries for current week
  const weekEntries = entries.filter(e => {
    return e.dateISO >= weekRange.start && e.dateISO <= weekRange.end;
  });

  return (
    <div className="max-w-6xl mx-auto p-4">
      <WeeklyReview
        entries={weekEntries}
        catalogItems={catalog.items}
        weekStart={weekRange.start}
        weekEnd={weekRange.end}
        onSaveIntention={onSaveIntention}
      />
    </div>
  );
}
