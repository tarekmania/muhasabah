import React from 'react';
import { HistoryView } from '@/components/history-view';
import { Entry } from '@/types';

interface HistoryProps {
  entries: Entry[];
  onEditEntry: (entry: Entry) => void;
}

export default function History({ entries, onEditEntry }: HistoryProps) {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <HistoryView
        entries={entries}
        onEditEntry={onEditEntry}
      />
    </div>
  );
}
