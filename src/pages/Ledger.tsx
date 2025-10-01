import React, { useState } from 'react';
import { DailyLedger } from '@/components/daily-ledger';
import { Entry } from '@/types';
import { useCatalog } from '@/hooks/use-catalog';

interface LedgerProps {
  entries: Entry[];
}

export default function Ledger({ entries }: LedgerProps) {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const { catalog } = useCatalog();

  const entry = entries.find(e => e.dateISO === selectedDate) || null;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <DailyLedger
        entry={entry}
        catalogItems={catalog.items}
        date={selectedDate}
        entries={entries}
        onDateChange={setSelectedDate}
      />
    </div>
  );
}
