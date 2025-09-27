export type TagCategory = 'GOOD' | 'IMPROVE';

export type Tag = {
  id: string;
  label: string;
  category: TagCategory;
  common?: boolean;
};

export type Entry = {
  id: string;
  dateISO: string;
  good: { tagIds: string[]; note?: string } | null;
  improve: { tagIds: string[]; note?: string; tawbah?: boolean } | null;
  dua?: string;
};

export type Settings = {
  reminderHour: number;
  reminderMinute: number;
  biometricLock: boolean;
  privateMode: boolean;
};

export const seedTags: Tag[] = [
  { id: 'prayer', label: 'Prayer', category: 'GOOD', common: true },
  { id: 'charity', label: 'Charity', category: 'GOOD', common: true },
  { id: 'quran', label: "Qur'an", category: 'GOOD', common: true },
  { id: 'kindness', label: 'Kindness', category: 'GOOD' },
  { id: 'dhikr', label: 'Dhikr', category: 'GOOD' },
  { id: 'family', label: 'Family time', category: 'GOOD' },

  { id: 'anger', label: 'Anger', category: 'IMPROVE', common: true },
  { id: 'backbiting', label: 'Backbiting', category: 'IMPROVE', common: true },
  { id: 'delay-prayer', label: 'Delayed prayer', category: 'IMPROVE', common: true },
  { id: 'waste-time', label: 'Time wasting', category: 'IMPROVE' },
  { id: 'gossip', label: 'Gossip', category: 'IMPROVE' },
  { id: 'impatience', label: 'Impatience', category: 'IMPROVE' },
];

export const curated_duas = [
  "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
  "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
  "اللَّهُمَّ اغْفِرْ لِي ذَنْبِي وَوَسِّعْ لِي فِي دَارِي وَبَارِكْ لِي فِيمَا رَزَقْتَنِي",
  "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً",
  "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى",
];