import { Entry } from '@/types';

/**
 * Calculate the number of days since the first entry
 */
export function calculateDaysSinceFirstEntry(entries: Entry[]): number {
  if (entries.length === 0) return 0;
  
  const sortedEntries = [...entries].sort((a, b) => a.dateISO.localeCompare(b.dateISO));
  const firstDate = new Date(sortedEntries[0].dateISO);
  const today = new Date();
  
  const diffTime = Math.abs(today.getTime() - firstDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}
