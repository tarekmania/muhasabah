export type ItemType = 'GOOD' | 'IMPROVE' | 'SEVERE' | 'MISSED_OPPORTUNITY';

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
  arabic?: string;
  transliteration?: string;
  meaning?: string;
  context?: 'post_salah' | 'morning' | 'evening' | 'sleep' | 'travel' | 'eating' | 'general';
  suggested_counts?: number[];
  hadith_reference?: string;
  default_count?: number;
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

export type UsageCounter = Record<string, number>;

export type WeeklySummary = {
  weekStart: string;
  weekEnd: string;
  mostConsistentGood?: {
    itemId: string;
    count: number;
    title: string;
  };
  mostFrequentImprovement?: {
    itemId: string;
    count: number;
    title: string;
  };
  topItems: Array<{
    itemId: string;
    title: string;
    counts: number[];
    type: ItemType;
  }>;
  intention?: string;
};

export type DailyLedger = {
  date: string;
  entries: Array<{
    itemId: string;
    title: string;
    count: number;
    type: ItemType;
    context?: string;
    note?: string;
  }>;
};

export type EntryStatus = 'draft' | 'complete' | 'reviewed';

export type Entry = {
  id: string;
  dateISO: string;
  status?: EntryStatus;
  good: { tagIds?: string[]; itemIds?: string[]; note?: string; qty?: Record<string, number> } | null;
  improve: { tagIds?: string[]; itemIds?: string[]; note?: string; tawbah?: boolean; qty?: Record<string, number> } | null;
  severeSlip?: { itemIds: string[]; note?: string; tawbah: boolean; guidance?: string; qty?: Record<string, number> } | null;
  missedOpportunity?: { itemIds: string[]; note?: string; intention?: string; qty?: Record<string, number> } | null;
  dua?: string;
  privacy_level?: 'normal' | 'private' | 'highly_sensitive';
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
    { id: 'finance', title: 'Finance & Wealth', emoji: '💰' },
    { id: 'seasonal', title: 'Seasonal & Special', emoji: '🌙' },
    { id: 'emotions', title: 'Emotions & Mental Health', emoji: '💭' },
  ],
  items: [
    // Prayer & Worship - GOOD (Expanded)
    { id: 'fajr', title: 'Fajr on time', category_id: 'prayer', type: 'GOOD', emoji: '🌅' },
    { id: 'five-prayers', title: '5 daily prayers', category_id: 'prayer', type: 'GOOD', emoji: '🤲' },
    { id: 'sunnah-prayers', title: 'Sunnah prayers', category_id: 'prayer', type: 'GOOD', emoji: '🕌' },
    { id: 'tahajjud', title: 'Tahajjud/Qiyam', category_id: 'prayer', type: 'GOOD', emoji: '🌙' },
    { id: 'dua-after-prayer', title: 'Dua after prayer', category_id: 'prayer', type: 'GOOD', emoji: '🤲' },
    { id: 'focused-prayer', title: 'Prayed with focus', category_id: 'prayer', type: 'GOOD', emoji: '🎯' },
    { id: 'made-up-prayer', title: 'Made up missed prayer', category_id: 'prayer', type: 'GOOD', emoji: '🔄' },
    { id: 'mosque-attendance', title: 'Attended mosque', category_id: 'prayer', type: 'GOOD', emoji: '🕌' },
    { id: 'friday-prayer', title: 'Attended Jumu\'ah', category_id: 'prayer', type: 'GOOD', emoji: '🕌' },
    { id: 'duha-prayer', title: 'Duha prayer', category_id: 'prayer', type: 'GOOD', emoji: '☀️' },
    { id: 'witr-prayer', title: 'Witr prayer', category_id: 'prayer', type: 'GOOD', emoji: '🌙' },
    { id: 'ishraq-prayer', title: 'Ishraq prayer', category_id: 'prayer', type: 'GOOD', emoji: '🌅' },
    { id: 'tahiyyatul-masjid', title: 'Tahiyyat al-Masjid', category_id: 'prayer', type: 'GOOD', emoji: '🕌' },
    { id: 'prayer-in-congregation', title: 'Prayed in congregation', category_id: 'prayer', type: 'GOOD', emoji: '👥' },
    { id: 'first-row-prayer', title: 'Prayed in first row', category_id: 'prayer', type: 'GOOD', emoji: '1️⃣' },
    { id: 'early-mosque-arrival', title: 'Arrived early to mosque', category_id: 'prayer', type: 'GOOD', emoji: '⏰' },
    { id: 'salat-istikharah', title: 'Salat al-Istikhara', category_id: 'prayer', type: 'GOOD', emoji: '🤲' },
    { id: 'salat-tawbah', title: 'Salat al-Tawbah', category_id: 'prayer', type: 'GOOD', emoji: '💚' },
    { id: 'salat-hajah', title: 'Salat al-Hajah', category_id: 'prayer', type: 'GOOD', emoji: '🙏' },
    { id: 'salat-taraweeh', title: 'Taraweeh prayer', category_id: 'prayer', type: 'GOOD', emoji: '🌙' },
    { id: 'eclipse-prayer', title: 'Eclipse prayer', category_id: 'prayer', type: 'GOOD', emoji: '🌑' },
    { id: 'rain-prayer', title: 'Rain prayer (Istisqa)', category_id: 'prayer', type: 'GOOD', emoji: '🌧️' },
    { id: 'eid-prayer', title: 'Eid prayer', category_id: 'prayer', type: 'GOOD', emoji: '🎉' },
    
    // Prayer & Worship - IMPROVE (Expanded)
    { id: 'delayed-prayer', title: 'Delayed prayer', category_id: 'prayer', type: 'IMPROVE', emoji: '⏰' },
    { id: 'missed-prayer', title: 'Missed prayer', category_id: 'prayer', type: 'IMPROVE', emoji: '❌' },
    { id: 'rushed-prayer', title: 'Rushed through prayer', category_id: 'prayer', type: 'IMPROVE', emoji: '⏰' },
    { id: 'distracted-prayer', title: 'Distracted during prayer', category_id: 'prayer', type: 'IMPROVE', emoji: '💭' },
    { id: 'forgot-dhikr', title: 'Forgot dhikr after prayer', category_id: 'prayer', type: 'IMPROVE', emoji: '🤲' },
    { id: 'missed-sunnah', title: 'Skipped sunnah prayers', category_id: 'prayer', type: 'IMPROVE', emoji: '🕌' },
    { id: 'phone-during-prayer', title: 'Used phone during prayer time', category_id: 'prayer', type: 'IMPROVE', emoji: '📱' },
    { id: 'prayed-without-wudu', title: 'Rushed wudu', category_id: 'prayer', type: 'IMPROVE', emoji: '💧' },
    { id: 'missed-congregation', title: 'Missed congregation prayer', category_id: 'prayer', type: 'IMPROVE', emoji: '👥' },
    { id: 'skipped-fajr', title: 'Skipped Fajr', category_id: 'prayer', type: 'IMPROVE', emoji: '❌' },
    { id: 'combined-prayers-unnecessarily', title: 'Combined prayers without need', category_id: 'prayer', type: 'IMPROVE', emoji: '⚠️' },
    { id: 'incomplete-prayer', title: 'Incomplete prayer movements', category_id: 'prayer', type: 'IMPROVE', emoji: '⚠️' },
    
    // Qur'an & Dhikr
    { id: 'quran-reading', title: 'Quran reading', category_id: 'quran', type: 'GOOD', emoji: '📖', suggested_counts: [1, 5, 10], default_count: 1 },
    
    // Post-Salah Dhikr (33-33-34 formula)
    { 
      id: 'post-salah-tasbih', 
      title: 'Post-Salah Tasbih', 
      category_id: 'quran', 
      type: 'GOOD', 
      emoji: '🕌',
      arabic: 'سُبْحَانَ اللهِ ٣٣ × الْحَمْدُ لِلَّهِ ٣٣ × اللهُ أَكْبَرُ ٣٤',
      transliteration: 'Subhan Allah (33x), Alhamdulillah (33x), Allahu Akbar (34x)',
      meaning: 'Glory be to Allah, Praise be to Allah, Allah is Greatest',
      context: 'post_salah',
      suggested_counts: [1, 5],
      default_count: 1,
      hadith_reference: 'Sahih Muslim 596'
    },
    { 
      id: 'subhan-allah', 
      title: 'Subhan Allah', 
      category_id: 'quran', 
      type: 'GOOD', 
      emoji: '🕊️',
      arabic: 'سُبْحَانَ اللهِ',
      transliteration: 'Subhan Allah',
      meaning: 'Glory be to Allah',
      context: 'general',
      suggested_counts: [1, 10, 33, 100],
      default_count: 33
    },
    { 
      id: 'alhamdulillah', 
      title: 'Alhamdulillah', 
      category_id: 'quran', 
      type: 'GOOD', 
      emoji: '🙏',
      arabic: 'الْحَمْدُ لِلَّهِ',
      transliteration: 'Alhamdulillah',
      meaning: 'Praise be to Allah',
      context: 'general',
      suggested_counts: [1, 10, 33, 100],
      default_count: 33
    },
    { 
      id: 'allahu-akbar', 
      title: 'Allahu Akbar', 
      category_id: 'quran', 
      type: 'GOOD', 
      emoji: '☝️',
      arabic: 'اللهُ أَكْبَرُ',
      transliteration: 'Allahu Akbar',
      meaning: 'Allah is Greatest',
      context: 'general',
      suggested_counts: [1, 10, 34, 100],
      default_count: 34
    },
    
    // Daily Dhikr with specific counts
    { 
      id: 'istighfar-100', 
      title: 'Istighfar (100x)', 
      category_id: 'quran', 
      type: 'GOOD', 
      emoji: '🤲',
      arabic: 'أَسْتَغْفِرُ اللهَ',
      transliteration: 'Astaghfirullah',
      meaning: 'I seek forgiveness from Allah',
      context: 'general',
      suggested_counts: [1, 10, 100],
      default_count: 100,
      hadith_reference: 'Sahih Bukhari 6307'
    },
    { 
      id: 'salawat-100', 
      title: 'Salawat (100x)', 
      category_id: 'quran', 
      type: 'GOOD', 
      emoji: '💚',
      arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
      transliteration: 'Allahumma salli ala Muhammad',
      meaning: 'O Allah, send blessings upon Muhammad',
      context: 'general',
      suggested_counts: [1, 10, 100],
      default_count: 100
    },
    { 
      id: 'la-ilaha-illa-allah', 
      title: 'La ilaha illa Allah', 
      category_id: 'quran', 
      type: 'GOOD', 
      emoji: '☝️',
      arabic: 'لَا إِلَهَ إِلَّا اللهُ',
      transliteration: 'La ilaha illa Allah',
      meaning: 'There is no god but Allah',
      context: 'general',
      suggested_counts: [1, 10, 100],
      default_count: 100
    },
    
    // Morning & Evening Adhkar
    { 
      id: 'morning-adhkar', 
      title: 'Morning Adhkar', 
      category_id: 'quran', 
      type: 'GOOD', 
      emoji: '🌅',
      context: 'morning',
      suggested_counts: [1],
      default_count: 1,
      description: 'Complete morning remembrance collection'
    },
    { 
      id: 'evening-adhkar', 
      title: 'Evening Adhkar', 
      category_id: 'quran', 
      type: 'GOOD', 
      emoji: '🌇',
      context: 'evening',
      suggested_counts: [1],
      default_count: 1,
      description: 'Complete evening remembrance collection'
    },
    { 
      id: 'ayat-kursi', 
      title: 'Ayat al-Kursi', 
      category_id: 'quran', 
      type: 'GOOD', 
      emoji: '📿',
      arabic: 'آيَةُ الْكُرْسِيِّ',
      context: 'morning',
      suggested_counts: [1, 3],
      default_count: 1,
      hadith_reference: 'Sahih Bukhari 2311'
    },
    { 
      id: 'qul-huwallahu-ahad', 
      title: 'Qul Huwallahu Ahad (3x)', 
      category_id: 'quran', 
      type: 'GOOD', 
      emoji: '📖',
      arabic: 'قُلْ هُوَ اللهُ أَحَدٌ',
      context: 'morning',
      suggested_counts: [1, 3],
      default_count: 3,
      description: 'Surah Al-Ikhlas'
    },
    { 
      id: 'muawwidhatayn', 
      title: "Al-Mu'awwidhatayn (3x)", 
      category_id: 'quran', 
      type: 'GOOD', 
      emoji: '🛡️',
      arabic: 'المُعَوِّذَتَيْنِ',
      context: 'morning',
      suggested_counts: [1, 3],
      default_count: 3,
      description: 'Surah Al-Falaq and An-Nas for protection'
    },
    
    // Sleep & Travel Dhikr
    { 
      id: 'sleep-dhikr', 
      title: 'Sleep Dhikr', 
      category_id: 'quran', 
      type: 'GOOD', 
      emoji: '🌙',
      arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
      transliteration: 'Bismika Allahumma amutu wa ahya',
      meaning: 'In Your name, O Allah, I die and I live',
      context: 'sleep',
      suggested_counts: [1],
      default_count: 1
    },
    { 
      id: 'travel-dhikr', 
      title: 'Travel Dhikr', 
      category_id: 'quran', 
      type: 'GOOD', 
      emoji: '🚗',
      arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا',
      transliteration: 'Subhan alladhi sakhkhara lana hadha',
      meaning: 'Glory be to Him who has subjected this to us',
      context: 'travel',
      suggested_counts: [1],
      default_count: 1
    },
    { 
      id: 'eating-dhikr', 
      title: 'Eating Dhikr', 
      category_id: 'quran', 
      type: 'GOOD', 
      emoji: '🍽️',
      arabic: 'بِسْمِ اللهِ',
      transliteration: 'Bismillah',
      meaning: 'In the name of Allah',
      context: 'eating',
      suggested_counts: [1],
      default_count: 1
    },
    
    // Qur'an & Dhikr - IMPROVE
    { id: 'neglected-quran', title: 'Neglected Quran reading', category_id: 'quran', type: 'IMPROVE', emoji: '📖' },
    { id: 'rushed-quran', title: 'Rushed through Quran', category_id: 'quran', type: 'IMPROVE', emoji: '⏰' },
    { id: 'forgot-morning-adhkar', title: 'Forgot morning adhkar', category_id: 'quran', type: 'IMPROVE', emoji: '🌅' },
    { id: 'forgot-evening-adhkar', title: 'Forgot evening adhkar', category_id: 'quran', type: 'IMPROVE', emoji: '🌇' },
    { id: 'didnt-memorize', title: 'Didn\'t practice memorization', category_id: 'quran', type: 'IMPROVE', emoji: '📖' },
    { id: 'skipped-dhikr', title: 'Skipped daily dhikr', category_id: 'quran', type: 'IMPROVE', emoji: '📿' },
    
    // Character & Akhlaq - GOOD (Massively Expanded)
    { id: 'patience', title: 'Showed patience', category_id: 'character', type: 'GOOD', emoji: '😌' },
    { id: 'kindness', title: 'Act of kindness', category_id: 'character', type: 'GOOD', emoji: '💝' },
    { id: 'forgiveness', title: 'Forgave someone', category_id: 'character', type: 'GOOD', emoji: '🤗' },
    { id: 'gratitude', title: 'Expressed gratitude', category_id: 'character', type: 'GOOD', emoji: '🙏' },
    { id: 'smiled-stranger', title: 'Smiled at stranger', category_id: 'character', type: 'GOOD', emoji: '😊' },
    { id: 'controlled-anger', title: 'Controlled anger', category_id: 'character', type: 'GOOD', emoji: '🧘' },
    { id: 'spoke-gently', title: 'Spoke gently', category_id: 'character', type: 'GOOD', emoji: '🗣️' },
    { id: 'helped-someone', title: 'Helped someone in need', category_id: 'character', type: 'GOOD', emoji: '🤝' },
    { id: 'praised-allah', title: 'Praised Allah for blessing', category_id: 'character', type: 'GOOD', emoji: '🙌' },
    { id: 'made-peace', title: 'Made peace between people', category_id: 'character', type: 'GOOD', emoji: '🕊️' },
    { id: 'kept-promise', title: 'Kept a promise', category_id: 'character', type: 'GOOD', emoji: '✅' },
    { id: 'told-truth', title: 'Told the truth', category_id: 'character', type: 'GOOD', emoji: '💯' },
    { id: 'showed-mercy', title: 'Showed mercy', category_id: 'character', type: 'GOOD', emoji: '💚' },
    { id: 'gave-advice', title: 'Gave sincere advice', category_id: 'character', type: 'GOOD', emoji: '💬' },
    { id: 'lowered-gaze', title: 'Lowered gaze', category_id: 'character', type: 'GOOD', emoji: '👀' },
    { id: 'spoke-well', title: 'Spoke well of someone', category_id: 'character', type: 'GOOD', emoji: '💬' },
    { id: 'concealed-fault', title: 'Concealed someone\'s fault', category_id: 'character', type: 'GOOD', emoji: '🤐' },
    { id: 'visited-sick', title: 'Visited the sick', category_id: 'character', type: 'GOOD', emoji: '🏥' },
    { id: 'removed-harm', title: 'Removed harm from path', category_id: 'character', type: 'GOOD', emoji: '🧹' },
    { id: 'good-to-animals', title: 'Kind to animals', category_id: 'character', type: 'GOOD', emoji: '🐾' },
    { id: 'respected-elders', title: 'Respected elders', category_id: 'character', type: 'GOOD', emoji: '👴' },
    { id: 'compassionate-youth', title: 'Compassionate to youth', category_id: 'character', type: 'GOOD', emoji: '👦' },
    { id: 'controlled-tongue', title: 'Controlled tongue', category_id: 'character', type: 'GOOD', emoji: '👅' },
    { id: 'suppressed-desires', title: 'Suppressed bad desires', category_id: 'character', type: 'GOOD', emoji: '🛡️' },
    { id: 'showed-humility', title: 'Showed humility', category_id: 'character', type: 'GOOD', emoji: '🙇' },
    { id: 'maintained-ties', title: 'Maintained family ties', category_id: 'character', type: 'GOOD', emoji: '🤝' },
    { id: 'accepted-criticism', title: 'Accepted constructive criticism', category_id: 'character', type: 'GOOD', emoji: '📝' },
    { id: 'gave-benefit-doubt', title: 'Gave benefit of doubt', category_id: 'character', type: 'GOOD', emoji: '🤔' },
    
    // Character & Akhlaq - IMPROVE (Massively Expanded)
    { id: 'anger', title: 'Lost temper/anger', category_id: 'character', type: 'IMPROVE', emoji: '😤' },
    { id: 'pride', title: 'Pride/arrogance', category_id: 'character', type: 'IMPROVE', emoji: '🦚' },
    { id: 'impatience', title: 'Impatience', category_id: 'character', type: 'IMPROVE', emoji: '⏰' },
    { id: 'harsh-words', title: 'Harsh words', category_id: 'character', type: 'IMPROVE', emoji: '🗣️' },
    { id: 'jealousy', title: 'Felt jealous/envious', category_id: 'character', type: 'IMPROVE', emoji: '😒' },
    { id: 'complained', title: 'Complained excessively', category_id: 'character', type: 'IMPROVE', emoji: '😮‍💨' },
    { id: 'showed-off', title: 'Showed off/bragged', category_id: 'character', type: 'IMPROVE', emoji: '🦚' },
    { id: 'held-grudge', title: 'Held a grudge', category_id: 'character', type: 'IMPROVE', emoji: '😠' },
    { id: 'ungrateful', title: 'Felt ungrateful', category_id: 'character', type: 'IMPROVE', emoji: '😔' },
    { id: 'rude-behavior', title: 'Was rude to someone', category_id: 'character', type: 'IMPROVE', emoji: '😤' },
    { id: 'broke-promise', title: 'Broke a promise', category_id: 'character', type: 'IMPROVE', emoji: '💔' },
    { id: 'lied', title: 'Told a lie', category_id: 'character', type: 'IMPROVE', emoji: '🤥' },
    { id: 'exaggerated', title: 'Exaggerated/embellished', category_id: 'character', type: 'IMPROVE', emoji: '📢' },
    { id: 'mocked-someone', title: 'Mocked/ridiculed someone', category_id: 'character', type: 'IMPROVE', emoji: '😏' },
    { id: 'suspicious-thoughts', title: 'Had suspicious thoughts', category_id: 'character', type: 'IMPROVE', emoji: '🤨' },
    { id: 'eye-service', title: 'Showed off for people', category_id: 'character', type: 'IMPROVE', emoji: '👁️' },
    { id: 'stared-inappropriately', title: 'Didn\'t lower gaze', category_id: 'character', type: 'IMPROVE', emoji: '👀' },
    { id: 'wasted-speech', title: 'Wasted time in useless talk', category_id: 'character', type: 'IMPROVE', emoji: '💬' },
    { id: 'didnt-fulfill-trust', title: 'Didn\'t fulfill trust', category_id: 'character', type: 'IMPROVE', emoji: '⚠️' },
    { id: 'selfish-behavior', title: 'Acted selfishly', category_id: 'character', type: 'IMPROVE', emoji: '🤷' },
    { id: 'passive-aggressive', title: 'Passive aggressive behavior', category_id: 'character', type: 'IMPROVE', emoji: '😒' },
    { id: 'ignored-advice', title: 'Ignored good advice', category_id: 'character', type: 'IMPROVE', emoji: '🙅' },
    { id: 'disrespected-elder', title: 'Disrespected elder', category_id: 'character', type: 'IMPROVE', emoji: '😤' },
    { id: 'unkind-to-animals', title: 'Unkind to animals', category_id: 'character', type: 'IMPROVE', emoji: '🐾' },
    
    // Family & Relations - GOOD
    { id: 'family-time', title: 'Quality family time', category_id: 'family', type: 'GOOD', emoji: '👨‍👩‍👧‍👦' },
    { id: 'parents-duaa', title: 'Dua for parents', category_id: 'family', type: 'GOOD', emoji: '👨‍👩‍👧‍👦' },
    { id: 'spouse-kindness', title: 'Kind to spouse', category_id: 'family', type: 'GOOD', emoji: '💕' },
    { id: 'children-time', title: 'Time with children', category_id: 'family', type: 'GOOD', emoji: '👶' },
    { id: 'called-parents', title: 'Called/visited parents', category_id: 'family', type: 'GOOD', emoji: '📞' },
    { id: 'helped-household', title: 'Helped with household chores', category_id: 'family', type: 'GOOD', emoji: '🏠' },
    { id: 'taught-child', title: 'Taught child something beneficial', category_id: 'family', type: 'GOOD', emoji: '👨‍🏫' },
    { id: 'family-meal', title: 'Shared family meal', category_id: 'family', type: 'GOOD', emoji: '🍽️' },
    { id: 'listened-family', title: 'Listened to family member', category_id: 'family', type: 'GOOD', emoji: '👂' },
    
    // Family & Relations - IMPROVE
    { id: 'family-neglect', title: 'Neglected family', category_id: 'family', type: 'IMPROVE', emoji: '😔' },
    { id: 'argued-family', title: 'Argued with family', category_id: 'family', type: 'IMPROVE', emoji: '😠' },
    { id: 'ignored-spouse', title: 'Ignored spouse', category_id: 'family', type: 'IMPROVE', emoji: '😶' },
    { id: 'impatient-children', title: 'Impatient with children', category_id: 'family', type: 'IMPROVE', emoji: '😤' },
    { id: 'didnt-call-parents', title: 'Didn\'t contact parents', category_id: 'family', type: 'IMPROVE', emoji: '📵' },
    { id: 'broke-promise-family', title: 'Broke promise to family', category_id: 'family', type: 'IMPROVE', emoji: '💔' },
    
    // Community & Society - GOOD
    { id: 'helping-neighbor', title: 'Helped neighbor', category_id: 'community', type: 'GOOD', emoji: '🏠' },
    { id: 'community-service', title: 'Community service', category_id: 'community', type: 'GOOD', emoji: '🤝' },
    { id: 'visited-sick', title: 'Visited sick person', category_id: 'community', type: 'GOOD', emoji: '🏥' },
    { id: 'gave-directions', title: 'Gave directions to lost person', category_id: 'community', type: 'GOOD', emoji: '🗺️' },
    { id: 'shared-knowledge', title: 'Shared beneficial knowledge', category_id: 'community', type: 'GOOD', emoji: '📚' },
    { id: 'comforted-sad', title: 'Comforted someone sad', category_id: 'community', type: 'GOOD', emoji: '🤗' },
    { id: 'gave-ride', title: 'Gave ride to someone', category_id: 'community', type: 'GOOD', emoji: '🚗' },
    { id: 'helped-colleague', title: 'Helped colleague at work', category_id: 'community', type: 'GOOD', emoji: '💼' },
    { id: 'greeted-neighbor', title: 'Greeted neighbor warmly', category_id: 'community', type: 'GOOD', emoji: '👋' },
    
    // Community & Society - IMPROVE
    { id: 'backbiting', title: 'Backbiting/gossip', category_id: 'community', type: 'IMPROVE', emoji: '🗣️' },
    { id: 'judging-others', title: 'Judging others', category_id: 'community', type: 'IMPROVE', emoji: '👁️' },
    { id: 'ignored-greeting', title: 'Ignored neighbor\'s greeting', category_id: 'community', type: 'IMPROVE', emoji: '😶' },
    { id: 'didnt-help-asked', title: 'Didn\'t help when asked', category_id: 'community', type: 'IMPROVE', emoji: '🙅' },
    { id: 'avoided-visiting-sick', title: 'Avoided visiting sick/elderly', category_id: 'community', type: 'IMPROVE', emoji: '🏥' },
    { id: 'rude-service-worker', title: 'Rude to service worker', category_id: 'community', type: 'IMPROVE', emoji: '😤' },
    { id: 'didnt-reconcile', title: 'Didn\'t reconcile after argument', category_id: 'community', type: 'IMPROVE', emoji: '💔' },
    
    // Charity & Giving - GOOD
    { id: 'gave-charity', title: 'Gave charity', category_id: 'charity', type: 'GOOD', emoji: '💝' },
    { id: 'shared-food', title: 'Shared food with neighbor', category_id: 'charity', type: 'GOOD', emoji: '🍽️' },
    { id: 'paid-zakat', title: 'Paid zakat on time', category_id: 'charity', type: 'GOOD', emoji: '💰' },
    { id: 'helped-poor', title: 'Helped poor person', category_id: 'charity', type: 'GOOD', emoji: '🤲' },
    { id: 'donated-clothes', title: 'Donated clothes/items', category_id: 'charity', type: 'GOOD', emoji: '👕' },
    { id: 'sponsored-orphan', title: 'Sponsored orphan/needy', category_id: 'charity', type: 'GOOD', emoji: '👶' },
    
    // Charity & Giving - IMPROVE
    { id: 'stingy-when-able', title: 'Was stingy when could afford', category_id: 'charity', type: 'IMPROVE', emoji: '💸' },
    { id: 'delayed-zakat', title: 'Delayed paying zakat', category_id: 'charity', type: 'IMPROVE', emoji: '⏰' },
    { id: 'ignored-beggar', title: 'Ignored beggar/needy', category_id: 'charity', type: 'IMPROVE', emoji: '🙅' },
    
    // Learning & Growth - GOOD
    { id: 'read-islamic-book', title: 'Read Islamic book', category_id: 'study', type: 'GOOD', emoji: '📚' },
    { id: 'attended-lecture', title: 'Attended Islamic lecture', category_id: 'study', type: 'GOOD', emoji: '🎓' },
    { id: 'learned-new-dua', title: 'Learned new dua', category_id: 'study', type: 'GOOD', emoji: '🤲' },
    { id: 'memorized-quran', title: 'Memorized Quran verses', category_id: 'study', type: 'GOOD', emoji: '📖' },
    { id: 'studied-hadith', title: 'Studied hadith', category_id: 'study', type: 'GOOD', emoji: '📜' },
    { id: 'learned-arabic', title: 'Practiced Arabic', category_id: 'study', type: 'GOOD', emoji: '🔤' },
    
    // Learning & Growth - IMPROVE
    { id: 'neglected-studies', title: 'Neglected Islamic studies', category_id: 'study', type: 'IMPROVE', emoji: '📚' },
    { id: 'skipped-learning', title: 'Skipped learning opportunity', category_id: 'study', type: 'IMPROVE', emoji: '🎓' },
    
    // Work & Productivity - GOOD
    { id: 'worked-with-ihsan', title: 'Worked with excellence', category_id: 'work', type: 'GOOD', emoji: '💼' },
    { id: 'helped-coworker', title: 'Helped coworker', category_id: 'work', type: 'GOOD', emoji: '🤝' },
    { id: 'honest-in-business', title: 'Was honest in business', category_id: 'work', type: 'GOOD', emoji: '🤝' },
    { id: 'fulfilled-duties', title: 'Fulfilled work duties', category_id: 'work', type: 'GOOD', emoji: '✅' },
    
    // Work & Productivity - IMPROVE
    { id: 'procrastinated-work', title: 'Procrastinated important tasks', category_id: 'work', type: 'IMPROVE', emoji: '⏰' },
    { id: 'dishonest-work', title: 'Was dishonest at work', category_id: 'work', type: 'IMPROVE', emoji: '🚫' },
    { id: 'neglected-duties', title: 'Neglected work/study duties', category_id: 'work', type: 'IMPROVE', emoji: '📋' },
    
    // Health & Wellness - GOOD
    { id: 'exercised', title: 'Exercised/stayed active', category_id: 'health', type: 'GOOD', emoji: '🏃' },
    { id: 'ate-healthy', title: 'Ate healthy food', category_id: 'health', type: 'GOOD', emoji: '🥗' },
    { id: 'cared-for-body', title: 'Took care of body', category_id: 'health', type: 'GOOD', emoji: '🌱' },
    { id: 'got-enough-sleep', title: 'Got adequate sleep', category_id: 'health', type: 'GOOD', emoji: '😴' },
    
    // Health & Wellness - IMPROVE
    { id: 'neglected-health', title: 'Neglected health/exercise', category_id: 'health', type: 'IMPROVE', emoji: '🏃' },
    { id: 'ate-unhealthy', title: 'Ate unhealthy food', category_id: 'health', type: 'IMPROVE', emoji: '🍔' },
    { id: 'stayed-up-late', title: 'Stayed up too late', category_id: 'health', type: 'IMPROVE', emoji: '🌙' },
    
    // Time & Priorities - GOOD
    { id: 'productive-time', title: 'Used time well', category_id: 'time', type: 'GOOD', emoji: '⏰' },
    { id: 'early-sleep', title: 'Slept early', category_id: 'time', type: 'GOOD', emoji: '😴' },
    { id: 'woke-up-early', title: 'Woke up early', category_id: 'time', type: 'GOOD', emoji: '🌅' },
    { id: 'planned-day', title: 'Planned my day', category_id: 'time', type: 'GOOD', emoji: '📋' },
    { id: 'prioritized-important', title: 'Prioritized important tasks', category_id: 'time', type: 'GOOD', emoji: '🎯' },
    
    // Time & Priorities - IMPROVE
    { id: 'time-wasting', title: 'Wasted time', category_id: 'time', type: 'IMPROVE', emoji: '⏰' },
    { id: 'oversleeping', title: 'Oversleeping', category_id: 'time', type: 'IMPROVE', emoji: '😴' },
    { id: 'procrastinated', title: 'Procrastinated tasks', category_id: 'time', type: 'IMPROVE', emoji: '⏰' },
    { id: 'stayed-up-late-unnecessarily', title: 'Stayed up late unnecessarily', category_id: 'time', type: 'IMPROVE', emoji: '🌙' },
    { id: 'poor-time-management', title: 'Poor time management', category_id: 'time', type: 'IMPROVE', emoji: '📅' },
    
    // Digital & Media - GOOD
    { id: 'mindful-media', title: 'Mindful media use', category_id: 'digital', type: 'GOOD', emoji: '📱' },
    { id: 'digital-detox', title: 'Digital detox time', category_id: 'digital', type: 'GOOD', emoji: '🔌' },
    { id: 'beneficial-content', title: 'Watched beneficial content', category_id: 'digital', type: 'GOOD', emoji: '📺' },
    { id: 'limited-screen-time', title: 'Limited screen time', category_id: 'digital', type: 'GOOD', emoji: '⏱️' },
    { id: 'phone-free-family-time', title: 'Phone-free family time', category_id: 'digital', type: 'GOOD', emoji: '👨‍👩‍👧‍👦' },
    
    // Digital & Media - IMPROVE
    { id: 'excessive-social-media', title: 'Excessive social media', category_id: 'digital', type: 'IMPROVE', emoji: '📱' },
    { id: 'inappropriate-content', title: 'Inappropriate content', category_id: 'digital', type: 'IMPROVE', emoji: '👁️' },
    { id: 'endless-scrolling', title: 'Endless scrolling', category_id: 'digital', type: 'IMPROVE', emoji: '📱' },
    { id: 'phone-during-family-time', title: 'Used phone during family time', category_id: 'digital', type: 'IMPROVE', emoji: '📱' },
    { id: 'compared-to-social-media', title: 'Compared life to social media', category_id: 'digital', type: 'IMPROVE', emoji: '📱' },
    { id: 'neglected-real-relationships', title: 'Neglected real relationships for online', category_id: 'digital', type: 'IMPROVE', emoji: '💔' },
    
    // Environment & Stewardship - GOOD
    { id: 'avoided-waste', title: 'Avoided waste', category_id: 'environment', type: 'GOOD', emoji: '♻️' },
    { id: 'conserved-water', title: 'Conserved water', category_id: 'environment', type: 'GOOD', emoji: '💧' },
    { id: 'recycled', title: 'Recycled properly', category_id: 'environment', type: 'GOOD', emoji: '♻️' },
    { id: 'planted-something', title: 'Planted something', category_id: 'environment', type: 'GOOD', emoji: '🌱' },
    { id: 'cleaned-environment', title: 'Cleaned environment', category_id: 'environment', type: 'GOOD', emoji: '🧹' },
    
    // Environment & Stewardship - IMPROVE
    { id: 'wasted-food', title: 'Wasted food', category_id: 'environment', type: 'IMPROVE', emoji: '🗑️' },
    { id: 'wasted-water', title: 'Wasted water', category_id: 'environment', type: 'IMPROVE', emoji: '💧' },
    { id: 'littered', title: 'Littered', category_id: 'environment', type: 'IMPROVE', emoji: '🗑️' },
    { id: 'excessive-consumption', title: 'Excessive consumption', category_id: 'environment', type: 'IMPROVE', emoji: '🛍️' },
    
    // Finance & Wealth - GOOD (New Category)
    { id: 'earned-halal', title: 'Earned through halal means', category_id: 'finance', type: 'GOOD', emoji: '✅' },
    { id: 'refused-riba', title: 'Refused interest/riba', category_id: 'finance', type: 'GOOD', emoji: '🚫' },
    { id: 'paid-debts', title: 'Paid off debts', category_id: 'finance', type: 'GOOD', emoji: '💳' },
    { id: 'helped-debtor', title: 'Helped debtor', category_id: 'finance', type: 'GOOD', emoji: '💰' },
    { id: 'honest-business', title: 'Honest in business dealings', category_id: 'finance', type: 'GOOD', emoji: '🤝' },
    { id: 'fair-wages', title: 'Paid fair wages', category_id: 'finance', type: 'GOOD', emoji: '💵' },
    { id: 'ethical-investment', title: 'Ethical halal investment', category_id: 'finance', type: 'GOOD', emoji: '📈' },
    { id: 'contentment-wealth', title: 'Content with provisions', category_id: 'finance', type: 'GOOD', emoji: '😌' },
    
    // Finance & Wealth - IMPROVE (New Category)
    { id: 'involved-riba', title: 'Involved in interest/riba', category_id: 'finance', type: 'IMPROVE', emoji: '⚠️' },
    { id: 'haram-income', title: 'Doubtful income source', category_id: 'finance', type: 'IMPROVE', emoji: '⚠️' },
    { id: 'delayed-debt-payment', title: 'Delayed debt payment', category_id: 'finance', type: 'IMPROVE', emoji: '💳' },
    { id: 'dishonest-business', title: 'Dishonest business practice', category_id: 'finance', type: 'IMPROVE', emoji: '📉' },
    { id: 'hoarded-wealth', title: 'Hoarded wealth', category_id: 'finance', type: 'IMPROVE', emoji: '💰' },
    { id: 'excessive-materialism', title: 'Excessive materialism', category_id: 'finance', type: 'IMPROVE', emoji: '🛍️' },
    { id: 'underpaid-worker', title: 'Underpaid worker', category_id: 'finance', type: 'IMPROVE', emoji: '💸' },
    
    // Seasonal & Special - GOOD (New Category)
    { id: 'ramadan-fasting', title: 'Ramadan fasting', category_id: 'seasonal', type: 'GOOD', emoji: '🌙' },
    { id: 'taraweeh-ramadan', title: 'Taraweeh in Ramadan', category_id: 'seasonal', type: 'GOOD', emoji: '🕌' },
    { id: 'laylatul-qadr', title: 'Sought Laylatul Qadr', category_id: 'seasonal', type: 'GOOD', emoji: '✨' },
    { id: 'eid-prayer-early', title: 'Early Eid preparation', category_id: 'seasonal', type: 'GOOD', emoji: '🎉' },
    { id: 'eid-charity', title: 'Eid charity (Sadaqatul Fitr)', category_id: 'seasonal', type: 'GOOD', emoji: '💝' },
    { id: 'hajj-preparation', title: 'Hajj/Umrah preparation', category_id: 'seasonal', type: 'GOOD', emoji: '🕋' },
    { id: 'day-arafah-fast', title: 'Fasted Day of Arafah', category_id: 'seasonal', type: 'GOOD', emoji: '🌄' },
    { id: 'ashura-fast', title: 'Fasted Day of Ashura', category_id: 'seasonal', type: 'GOOD', emoji: '📅' },
    { id: 'muharram-good-deeds', title: 'Extra deeds in Muharram', category_id: 'seasonal', type: 'GOOD', emoji: '🌙' },
    { id: 'dhul-hijjah-deeds', title: 'Extra deeds in Dhul Hijjah', category_id: 'seasonal', type: 'GOOD', emoji: '📿' },
    { id: 'shaban-preparation', title: 'Prepared for Ramadan', category_id: 'seasonal', type: 'GOOD', emoji: '🌙' },
    { id: 'monday-thursday-fast', title: 'Monday/Thursday fast', category_id: 'seasonal', type: 'GOOD', emoji: '📅' },
    { id: 'white-days-fast', title: 'White days fast (13-15)', category_id: 'seasonal', type: 'GOOD', emoji: '🌕' },
    { id: 'six-shawwal', title: 'Six fasts of Shawwal', category_id: 'seasonal', type: 'GOOD', emoji: '6️⃣' },
    
    // Seasonal & Special - IMPROVE (New Category)
    { id: 'broke-ramadan-fast', title: 'Broke Ramadan fast without excuse', category_id: 'seasonal', type: 'IMPROVE', emoji: '❌' },
    { id: 'missed-taraweeh', title: 'Missed Taraweeh opportunities', category_id: 'seasonal', type: 'IMPROVE', emoji: '🕌' },
    { id: 'wasted-ramadan', title: 'Wasted Ramadan time', category_id: 'seasonal', type: 'IMPROVE', emoji: '⏰' },
    { id: 'neglected-last-ten', title: 'Neglected last 10 nights', category_id: 'seasonal', type: 'IMPROVE', emoji: '🌙' },
    { id: 'missed-eid-prayer', title: 'Missed Eid prayer', category_id: 'seasonal', type: 'IMPROVE', emoji: '❌' },
    { id: 'forgot-eid-charity', title: 'Forgot Sadaqatul Fitr', category_id: 'seasonal', type: 'IMPROVE', emoji: '💸' },
    
    // Emotions & Mental Health - GOOD (New Category)
    { id: 'managed-stress', title: 'Managed stress well', category_id: 'emotions', type: 'GOOD', emoji: '🧘' },
    { id: 'positive-mindset', title: 'Maintained positive mindset', category_id: 'emotions', type: 'GOOD', emoji: '😊' },
    { id: 'sought-help', title: 'Sought help when needed', category_id: 'emotions', type: 'GOOD', emoji: '🤝' },
    { id: 'supported-struggling', title: 'Supported someone struggling', category_id: 'emotions', type: 'GOOD', emoji: '💚' },
    { id: 'practiced-self-care', title: 'Practiced self-care', category_id: 'emotions', type: 'GOOD', emoji: '💆' },
    { id: 'expressed-feelings', title: 'Expressed feelings healthily', category_id: 'emotions', type: 'GOOD', emoji: '💬' },
    { id: 'took-break', title: 'Took necessary break', category_id: 'emotions', type: 'GOOD', emoji: '☕' },
    { id: 'breathed-deeply', title: 'Practiced mindful breathing', category_id: 'emotions', type: 'GOOD', emoji: '🌬️' },
    { id: 'trusted-allah-plan', title: 'Trusted Allah\'s plan', category_id: 'emotions', type: 'GOOD', emoji: '🤲' },
    
    // Emotions & Mental Health - IMPROVE (New Category)
    { id: 'overwhelmed', title: 'Felt overwhelmed', category_id: 'emotions', type: 'IMPROVE', emoji: '😰' },
    { id: 'anxious', title: 'Excessive anxiety', category_id: 'emotions', type: 'IMPROVE', emoji: '😟' },
    { id: 'neglected-mental-health', title: 'Neglected mental health', category_id: 'emotions', type: 'IMPROVE', emoji: '🧠' },
    { id: 'bottled-emotions', title: 'Bottled up emotions', category_id: 'emotions', type: 'IMPROVE', emoji: '🫙' },
    { id: 'compared-others', title: 'Compared self to others', category_id: 'emotions', type: 'IMPROVE', emoji: '📊' },
    { id: 'dwelled-on-past', title: 'Dwelled on past mistakes', category_id: 'emotions', type: 'IMPROVE', emoji: '⏪' },
    { id: 'feared-future', title: 'Excessive fear of future', category_id: 'emotions', type: 'IMPROVE', emoji: '🔮' },
    { id: 'isolated-self', title: 'Isolated self unnecessarily', category_id: 'emotions', type: 'IMPROVE', emoji: '🚪' },
    { id: 'major-sin', title: 'Major transgression', category_id: 'character', type: 'SEVERE', emoji: '⚠️' },
    { id: 'neglected-obligation', title: 'Neglected religious duty', category_id: 'prayer', type: 'SEVERE', emoji: '🚨' },
    { id: 'harmed-others', title: 'Caused harm to others', category_id: 'community', type: 'SEVERE', emoji: '💔' },
    { id: 'persistent-sin', title: 'Repeated wrongdoing', category_id: 'character', type: 'SEVERE', emoji: '🔄' },
    
    // Missed Opportunities for Closeness to Allah
    { id: 'missed-dhikr', title: 'Could have remembered Allah', category_id: 'quran', type: 'MISSED_OPPORTUNITY', emoji: '💭' },
    { id: 'missed-charity', title: 'Could have given charity', category_id: 'charity', type: 'MISSED_OPPORTUNITY', emoji: '🤲' },
    { id: 'missed-kindness', title: 'Could have been kinder', category_id: 'character', type: 'MISSED_OPPORTUNITY', emoji: '💝' },
    { id: 'missed-prayer-focus', title: 'Could have prayed with more focus', category_id: 'prayer', type: 'MISSED_OPPORTUNITY', emoji: '🎯' },
    { id: 'missed-gratitude', title: 'Could have been more grateful', category_id: 'character', type: 'MISSED_OPPORTUNITY', emoji: '🙏' },
  ],
  templates: [
    {
      id: 'morning-foundation',
      title: 'Morning Foundation',
      emoji: '🌅',
      good_item_ids: ['fajr', 'morning-adhkar', 'ayat-kursi', 'qul-huwallahu-ahad', 'muawwidhatayn'],
      improve_item_ids: [],
      default_dua: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
      deedCount: 5
    },
    {
      id: 'post-salah-dhikr',
      title: 'Post-Salah Dhikr',
      emoji: '🕌',
      good_item_ids: ['post-salah-tasbih', 'dua-after-prayer', 'ayat-kursi'],
      improve_item_ids: [],
      default_dua: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
      deedCount: 3
    },
    {
      id: 'family-mercy',
      title: 'Family Mercy',
      emoji: '👨‍👩‍👧‍👦',
      good_item_ids: ['family-time', 'parents-duaa', 'spouse-kindness', 'children-time'],
      improve_item_ids: ['family-neglect'],
      default_note: 'Time to strengthen family bonds',
      deedCount: 5
    },
    {
      id: 'work-with-ihsan',
      title: 'Work with Ihsān',
      emoji: '💼',
      good_item_ids: ['productive-time', 'patience', 'gratitude'],
      improve_item_ids: ['time-wasting', 'impatience'],
      default_dua: 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا أَعْطَيْتَنَا',
      deedCount: 5
    },
    {
      id: 'jumah-boost',
      title: 'Jumu\'ah Boost',
      emoji: '🕌',
      good_item_ids: ['salawat-100', 'istighfar-100', 'dua-after-prayer', 'quran-reading'],
      improve_item_ids: [],
      default_dua: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
      deedCount: 4
    },
    {
      id: 'ramadan-day',
      title: 'Ramadan Day',
      emoji: '🌙',
      good_item_ids: ['fajr', 'quran-reading', 'istighfar-100', 'salawat-100', 'tahajjud'],
      improve_item_ids: ['anger', 'impatience'],
      default_dua: 'اللَّهُمَّ بَلِّغْنَا رَمَضَانَ',
      deedCount: 7
    },
    {
      id: 'travel-kit',
      title: 'Travel Kit',
      emoji: '🚗',
      good_item_ids: ['travel-dhikr', 'ayat-kursi', 'muawwidhatayn', 'istighfar-100'],
      improve_item_ids: [],
      default_dua: 'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى',
      deedCount: 4
    },
    {
      id: 'exams-focus',
      title: 'Exams Focus',
      emoji: '📚',
      good_item_ids: ['fajr', 'istighfar-100', 'productive-time', 'gratitude'],
      improve_item_ids: ['time-wasting', 'oversleeping'],
      default_dua: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
      deedCount: 6
    },
    {
      id: 'character-building',
      title: 'Character Building',
      emoji: '✨',
      good_item_ids: ['patience', 'kindness', 'gratitude', 'forgiveness'],
      improve_item_ids: ['anger', 'pride', 'impatience', 'harsh-words'],
      deedCount: 8
    },
    {
      id: 'digital-balance',
      title: 'Digital Balance',
      emoji: '📱',
      good_item_ids: ['mindful-media', 'digital-detox', 'productive-time'],
      improve_item_ids: ['excessive-social-media', 'inappropriate-content', 'time-wasting'],
      deedCount: 6
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
