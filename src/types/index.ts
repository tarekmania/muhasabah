export type ItemType = 'GOOD' | 'IMPROVE';

export type CatalogCategory = {
  id: string;
  title: string;
  emoji?: string;
};

export type CatalogItem = {
  id: string;
  title: string;
  category_id: string;
  type: ItemType;
  emoji?: string;
  aliases?: string[];
  description?: string;
};

export type QuickTemplate = {
  id: string;
  title: string;
  emoji?: string;
  good_item_ids: string[];
  improve_item_ids: string[];
  default_dua?: string;
  default_note?: string;
  // derived for UI:
  deedCount?: number;
  usageCount?: number;
};

export type Catalog = {
  categories: CatalogCategory[];
  items: CatalogItem[];
  templates: QuickTemplate[];
};

export type SelectedState = {
  ids: string[];
  qty: Record<string, number>;
};

export type UsageStats = {
  itemUsage: Record<string, number>;
  templateUsage: Record<string, number>;
};

export type Entry = {
  id: string;
  dateISO: string;
  good: { tagIds?: string[]; itemIds?: string[]; note?: string; qty?: Record<string, number> } | null;
  improve: { tagIds?: string[]; itemIds?: string[]; note?: string; tawbah?: boolean; qty?: Record<string, number> } | null;
  dua?: string;
};

export type Settings = {
  reminderHour: number;
  reminderMinute: number;
  biometricLock: boolean;
  privateMode: boolean;
};

// Legacy types for backward compatibility
export type TagCategory = 'GOOD' | 'IMPROVE';
export type Tag = {
  id: string;
  label: string;
  category: TagCategory;
  common?: boolean;
};

export const seedCatalog: Catalog = {
  categories: [
    { id: 'prayer', title: 'Prayer & Worship', emoji: '🤲' },
    { id: 'quran', title: 'Quran & Dhikr', emoji: '📖' },
    { id: 'character', title: 'Character & Akhlaq', emoji: '✨' },
    { id: 'family', title: 'Family & Relations', emoji: '👨‍👩‍👧‍👦' },
    { id: 'community', title: 'Community & Society', emoji: '🌍' },
    { id: 'charity', title: 'Charity & Giving', emoji: '💝' },
    { id: 'study', title: 'Learning & Growth', emoji: '📚' },
    { id: 'work', title: 'Work & Productivity', emoji: '💼' },
    { id: 'health', title: 'Health & Wellness', emoji: '🌱' },
    { id: 'time', title: 'Time & Priorities', emoji: '⏰' },
    { id: 'digital', title: 'Digital & Media', emoji: '📱' },
    { id: 'environment', title: 'Environment & Stewardship', emoji: '🌿' },
  ],
  items: [
    // Prayer & Worship
    { id: 'fajr', title: 'Fajr on time', category_id: 'prayer', type: 'GOOD', emoji: '🌅' },
    { id: 'five-prayers', title: '5 daily prayers', category_id: 'prayer', type: 'GOOD', emoji: '🤲' },
    { id: 'sunnah-prayers', title: 'Sunnah prayers', category_id: 'prayer', type: 'GOOD', emoji: '🕌' },
    { id: 'tahajjud', title: 'Tahajjud/Qiyam', category_id: 'prayer', type: 'GOOD', emoji: '🌙' },
    { id: 'dua-after-prayer', title: 'Dua after prayer', category_id: 'prayer', type: 'GOOD', emoji: '🤲' },
    { id: 'delayed-prayer', title: 'Delayed prayer', category_id: 'prayer', type: 'IMPROVE', emoji: '⏰' },
    { id: 'missed-prayer', title: 'Missed prayer', category_id: 'prayer', type: 'IMPROVE', emoji: '❌' },
    
    // Qur'an & Dhikr
    { id: 'quran-reading', title: 'Quran reading', category_id: 'quran', type: 'GOOD', emoji: '📖' },
    { id: 'morning-adhkar', title: 'Morning adhkar', category_id: 'quran', type: 'GOOD', emoji: '🌅' },
    { id: 'evening-adhkar', title: 'Evening adhkar', category_id: 'quran', type: 'GOOD', emoji: '🌇' },
    { id: 'istighfar', title: 'Istighfar', category_id: 'quran', type: 'GOOD', emoji: '🤲' },
    { id: 'salawat', title: 'Salawat on Prophet', category_id: 'quran', type: 'GOOD', emoji: '💚' },
    { id: 'tahlil', title: 'La ilaha illa Allah', category_id: 'quran', type: 'GOOD', emoji: '☝️' },
    { id: 'tasbih', title: 'Subhan Allah', category_id: 'quran', type: 'GOOD', emoji: '🕊️' },
    
    // Character & Akhlaq
    { id: 'patience', title: 'Showed patience', category_id: 'character', type: 'GOOD', emoji: '😌' },
    { id: 'kindness', title: 'Act of kindness', category_id: 'character', type: 'GOOD', emoji: '💝' },
    { id: 'forgiveness', title: 'Forgave someone', category_id: 'character', type: 'GOOD', emoji: '🤗' },
    { id: 'gratitude', title: 'Expressed gratitude', category_id: 'character', type: 'GOOD', emoji: '🙏' },
    { id: 'anger', title: 'Lost temper/anger', category_id: 'character', type: 'IMPROVE', emoji: '😤' },
    { id: 'pride', title: 'Pride/arrogance', category_id: 'character', type: 'IMPROVE', emoji: '🦚' },
    { id: 'impatience', title: 'Impatience', category_id: 'character', type: 'IMPROVE', emoji: '⏰' },
    { id: 'harsh-words', title: 'Harsh words', category_id: 'character', type: 'IMPROVE', emoji: '🗣️' },
    
    // Family & Relations
    { id: 'family-time', title: 'Quality family time', category_id: 'family', type: 'GOOD', emoji: '👨‍👩‍👧‍👦' },
    { id: 'parents-duaa', title: 'Dua for parents', category_id: 'family', type: 'GOOD', emoji: '👨‍👩‍👧‍👦' },
    { id: 'spouse-kindness', title: 'Kind to spouse', category_id: 'family', type: 'GOOD', emoji: '💕' },
    { id: 'children-time', title: 'Time with children', category_id: 'family', type: 'GOOD', emoji: '👶' },
    { id: 'family-neglect', title: 'Neglected family', category_id: 'family', type: 'IMPROVE', emoji: '😔' },
    
    // Community & Society
    { id: 'helping-neighbor', title: 'Helped neighbor', category_id: 'community', type: 'GOOD', emoji: '🏠' },
    { id: 'community-service', title: 'Community service', category_id: 'community', type: 'GOOD', emoji: '🤝' },
    { id: 'backbiting', title: 'Backbiting/gossip', category_id: 'community', type: 'IMPROVE', emoji: '🗣️' },
    { id: 'judging-others', title: 'Judging others', category_id: 'community', type: 'IMPROVE', emoji: '👁️' },
    
    // Time & Priorities
    { id: 'productive-time', title: 'Used time well', category_id: 'time', type: 'GOOD', emoji: '⏰' },
    { id: 'early-sleep', title: 'Slept early', category_id: 'time', type: 'GOOD', emoji: '😴' },
    { id: 'time-wasting', title: 'Wasted time', category_id: 'time', type: 'IMPROVE', emoji: '⏰' },
    { id: 'oversleeping', title: 'Oversleeping', category_id: 'time', type: 'IMPROVE', emoji: '😴' },
    
    // Digital & Media
    { id: 'mindful-media', title: 'Mindful media use', category_id: 'digital', type: 'GOOD', emoji: '📱' },
    { id: 'digital-detox', title: 'Digital detox time', category_id: 'digital', type: 'GOOD', emoji: '🔌' },
    { id: 'excessive-social-media', title: 'Excessive social media', category_id: 'digital', type: 'IMPROVE', emoji: '📱' },
    { id: 'inappropriate-content', title: 'Inappropriate content', category_id: 'digital', type: 'IMPROVE', emoji: '👁️' },
  ],
  templates: [
    {
      id: 'morning-foundation',
      title: 'Morning Foundation',
      emoji: '🌅',
      good_item_ids: ['fajr', 'morning-adhkar', 'quran-reading'],
      improve_item_ids: [],
      default_dua: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ'
    },
    {
      id: 'family-mercy',
      title: 'Family Mercy',
      emoji: '👨‍👩‍👧‍👦',
      good_item_ids: ['family-time', 'parents-duaa', 'spouse-kindness'],
      improve_item_ids: ['family-neglect'],
      default_note: 'Time to strengthen family bonds'
    },
    {
      id: 'character-building',
      title: 'Character Building',
      emoji: '✨',
      good_item_ids: ['patience', 'kindness', 'gratitude'],
      improve_item_ids: ['anger', 'pride', 'impatience'],
    },
    {
      id: 'friday-uplift',
      title: 'Friday Uplift',
      emoji: '🕌',
      good_item_ids: ['salawat', 'istighfar', 'dua-after-prayer'],
      improve_item_ids: [],
      default_dua: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ'
    },
    {
      id: 'digital-balance',
      title: 'Digital Balance',
      emoji: '📱',
      good_item_ids: ['mindful-media', 'digital-detox'],
      improve_item_ids: ['excessive-social-media', 'inappropriate-content'],
    }
  ]
};

// Legacy tags for backward compatibility
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