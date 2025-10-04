export type GuidedEntryState = {
  currentStep: number; // 1-9
  dateISO: string;
  mood?: number; // 1-5
  selectedItems: Record<string, number>; // itemId -> quantity
  notes: {
    personal?: string;
    gratitude?: string;
    tomorrowIntention?: string;
  };
  tawbah: boolean;
  dua?: string;
  completedSteps: number[];
  lastSaved: string; // ISO timestamp
};

export type TimeContext = 'morning' | 'afternoon' | 'evening' | 'night';

export const getCurrentTimeContext = (): TimeContext => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning'; // Fajr-Dhuhr
  if (hour < 15) return 'afternoon'; // Dhuhr-Asr
  if (hour < 18) return 'evening'; // Asr-Maghrib
  return 'night'; // Maghrib-Isha
};
