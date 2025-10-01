export type ItemType = 'GOOD' | 'IMPROVE' | 'SEVERE' | 'MISSED_OPPORTUNITY';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type FrequencyRecommendation = 'daily' | 'weekly' | 'occasional' | 'situational';
export type ScenarioContext = 'workplace' | 'travel' | 'social' | 'home' | 'mosque' | 'study' | 'general';

export type CatalogCategory = {
  id: string;
  title: string;
  emoji?: string;
  scenario?: ScenarioContext;
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
  difficulty?: DifficultyLevel;
  time_commitment?: string; // e.g. "5 minutes", "15-30 minutes"
  frequency?: FrequencyRecommendation;
  scenario?: ScenarioContext;
  reward_description?: string;
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
    { id: 'work', title: 'Work & Productivity', emoji: '💼', scenario: 'workplace' },
    { id: 'health', title: 'Health & Wellness', emoji: '🌱' },
    { id: 'time', title: 'Time & Priorities', emoji: '⏰' },
    { id: 'digital', title: 'Digital & Media', emoji: '📱' },
    { id: 'environment', title: 'Environment & Stewardship', emoji: '🌿' },
    { id: 'finance', title: 'Finance & Wealth', emoji: '💰' },
    { id: 'seasonal', title: 'Seasonal & Special', emoji: '🌙' },
    { id: 'emotions', title: 'Emotions & Mental Health', emoji: '💭' },
    // NEW: Scenario-based categories
    { id: 'workplace', title: 'Workplace Ethics', emoji: '💼', scenario: 'workplace' },
    { id: 'travel-journey', title: 'Travel & Journey', emoji: '✈️', scenario: 'travel' },
    { id: 'social-events', title: 'Social Events', emoji: '🎉', scenario: 'social' },
    { id: 'ramadan', title: 'Ramadan Special', emoji: '🌙', scenario: 'general' },
    { id: 'hajj-umrah', title: 'Hajj & Umrah', emoji: '🕋', scenario: 'travel' },
    { id: 'student-life', title: 'Student Life', emoji: '🎓', scenario: 'study' },
    { id: 'marriage', title: 'Marriage & Family', emoji: '💑', scenario: 'home' },
    { id: 'parenting', title: 'Parenting', emoji: '👶', scenario: 'home' },
  ],
  items: [
    // Prayer & Worship - GOOD (Enhanced with new properties)
    { 
      id: 'fajr', 
      title: 'Fajr on time', 
      category_id: 'prayer', 
      type: 'GOOD', 
      emoji: '🌅',
      difficulty: 'intermediate',
      time_commitment: '5-10 minutes',
      frequency: 'daily',
      reward_description: 'Protection for the entire day',
      hadith_reference: 'Sahih Muslim 657'
    },
    { 
      id: 'five-prayers', 
      title: '5 daily prayers', 
      category_id: 'prayer', 
      type: 'GOOD', 
      emoji: '🤲',
      difficulty: 'beginner',
      time_commitment: '30-40 minutes total',
      frequency: 'daily',
      reward_description: 'Foundation of Islam, expiation of sins',
      hadith_reference: 'Sahih Bukhari 528'
    },
    { 
      id: 'tahajjud', 
      title: 'Tahajjud/Qiyam', 
      category_id: 'prayer', 
      type: 'GOOD', 
      emoji: '🌙',
      difficulty: 'advanced',
      time_commitment: '15-30 minutes',
      frequency: 'daily',
      reward_description: 'Closest time to Allah, special honor',
      hadith_reference: 'Sahih Muslim 758'
    },
    { id: 'sunnah-prayers', title: 'Sunnah prayers', category_id: 'prayer', type: 'GOOD', emoji: '🕌', difficulty: 'beginner', frequency: 'daily' },
    { id: 'dua-after-prayer', title: 'Dua after prayer', category_id: 'prayer', type: 'GOOD', emoji: '🤲', difficulty: 'beginner', frequency: 'daily' },
    { id: 'focused-prayer', title: 'Prayed with focus', category_id: 'prayer', type: 'GOOD', emoji: '🎯', difficulty: 'intermediate', frequency: 'daily' },
    { id: 'made-up-prayer', title: 'Made up missed prayer', category_id: 'prayer', type: 'GOOD', emoji: '🔄', difficulty: 'beginner', frequency: 'occasional' },
    { id: 'mosque-attendance', title: 'Attended mosque', category_id: 'prayer', type: 'GOOD', emoji: '🕌', difficulty: 'beginner', frequency: 'daily', scenario: 'mosque' },
    { id: 'friday-prayer', title: 'Attended Jumu\'ah', category_id: 'prayer', type: 'GOOD', emoji: '🕌', difficulty: 'beginner', frequency: 'weekly', scenario: 'mosque' },
    { id: 'duha-prayer', title: 'Duha prayer', category_id: 'prayer', type: 'GOOD', emoji: '☀️', difficulty: 'intermediate', frequency: 'daily' },
    { id: 'witr-prayer', title: 'Witr prayer', category_id: 'prayer', type: 'GOOD', emoji: '🌙', difficulty: 'beginner', frequency: 'daily' },
    { id: 'ishraq-prayer', title: 'Ishraq prayer', category_id: 'prayer', type: 'GOOD', emoji: '🌅', difficulty: 'intermediate', frequency: 'occasional' },
    { id: 'tahiyyatul-masjid', title: 'Tahiyyat al-Masjid', category_id: 'prayer', type: 'GOOD', emoji: '🕌', difficulty: 'beginner', frequency: 'situational', scenario: 'mosque' },
    { id: 'prayer-in-congregation', title: 'Prayed in congregation', category_id: 'prayer', type: 'GOOD', emoji: '👥', difficulty: 'beginner', frequency: 'daily', scenario: 'mosque' },
    { id: 'first-row-prayer', title: 'Prayed in first row', category_id: 'prayer', type: 'GOOD', emoji: '1️⃣', difficulty: 'beginner', frequency: 'situational', scenario: 'mosque' },
    { id: 'early-mosque-arrival', title: 'Arrived early to mosque', category_id: 'prayer', type: 'GOOD', emoji: '⏰', difficulty: 'intermediate', frequency: 'situational', scenario: 'mosque' },
    { id: 'salat-istikharah', title: 'Salat al-Istikhara', category_id: 'prayer', type: 'GOOD', emoji: '🤲', difficulty: 'intermediate', frequency: 'occasional' },
    { id: 'salat-tawbah', title: 'Salat al-Tawbah', category_id: 'prayer', type: 'GOOD', emoji: '💚', difficulty: 'beginner', frequency: 'occasional' },
    { id: 'salat-hajah', title: 'Salat al-Hajah', category_id: 'prayer', type: 'GOOD', emoji: '🙏', difficulty: 'intermediate', frequency: 'occasional' },
    { id: 'salat-taraweeh', title: 'Taraweeh prayer', category_id: 'prayer', type: 'GOOD', emoji: '🌙', difficulty: 'beginner', frequency: 'situational' },
    { id: 'eclipse-prayer', title: 'Eclipse prayer', category_id: 'prayer', type: 'GOOD', emoji: '🌑', difficulty: 'beginner', frequency: 'situational' },
    { id: 'rain-prayer', title: 'Rain prayer (Istisqa)', category_id: 'prayer', type: 'GOOD', emoji: '🌧️', difficulty: 'beginner', frequency: 'situational' },
    { id: 'eid-prayer', title: 'Eid prayer', category_id: 'prayer', type: 'GOOD', emoji: '🎉', difficulty: 'beginner', frequency: 'situational', scenario: 'social' },
    
    // Prayer & Worship - IMPROVE (Massively Expanded)
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
    { id: 'prayed-too-fast', title: 'Prayed too quickly', category_id: 'prayer', type: 'IMPROVE', emoji: '⚡' },
    { id: 'prayer-after-adhan-delay', title: 'Delayed after adhan without excuse', category_id: 'prayer', type: 'IMPROVE', emoji: '📢' },
    { id: 'skipped-takbeer-ula', title: 'Missed opening takbeer', category_id: 'prayer', type: 'IMPROVE', emoji: '🕌' },
    { id: 'fidgeting-prayer', title: 'Fidgeted excessively in prayer', category_id: 'prayer', type: 'IMPROVE', emoji: '🤸' },
    { id: 'missed-witr', title: 'Missed witr prayer', category_id: 'prayer', type: 'IMPROVE', emoji: '🌙' },
    { id: 'no-khushoo', title: 'Lacked khushoo (humility)', category_id: 'prayer', type: 'IMPROVE', emoji: '😐' },
    { id: 'thinking-worldly-prayer', title: 'Thought about worldly matters in prayer', category_id: 'prayer', type: 'IMPROVE', emoji: '🌍' },
    { id: 'prayed-sitting-no-excuse', title: 'Prayed sitting without excuse', category_id: 'prayer', type: 'IMPROVE', emoji: '🪑' },
    { id: 'didnt-follow-imam', title: 'Didn\'t follow imam properly', category_id: 'prayer', type: 'IMPROVE', emoji: '👥' },
    { id: 'looked-around-prayer', title: 'Looked around during prayer', category_id: 'prayer', type: 'IMPROVE', emoji: '👀' },
    { id: 'talked-during-khutbah', title: 'Talked during Khutbah', category_id: 'prayer', type: 'IMPROVE', emoji: '🗣️' },
    { id: 'left-mosque-immediately', title: 'Left mosque immediately after prayer', category_id: 'prayer', type: 'IMPROVE', emoji: '🚪' },
    { id: 'prayed-wrong-qiblah', title: 'Didn\'t verify qiblah direction', category_id: 'prayer', type: 'IMPROVE', emoji: '🧭' },
    { id: 'no-sutrah', title: 'Prayed without sutrah', category_id: 'prayer', type: 'IMPROVE', emoji: '🚧' },
    
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
    
    // Qur'an & Dhikr - IMPROVE (Massively Expanded)
    { id: 'neglected-quran', title: 'Neglected Quran reading', category_id: 'quran', type: 'IMPROVE', emoji: '📖' },
    { id: 'rushed-quran', title: 'Rushed through Quran', category_id: 'quran', type: 'IMPROVE', emoji: '⏰' },
    { id: 'forgot-morning-adhkar', title: 'Forgot morning adhkar', category_id: 'quran', type: 'IMPROVE', emoji: '🌅' },
    { id: 'forgot-evening-adhkar', title: 'Forgot evening adhkar', category_id: 'quran', type: 'IMPROVE', emoji: '🌇' },
    { id: 'didnt-memorize', title: 'Didn\'t practice memorization', category_id: 'quran', type: 'IMPROVE', emoji: '📖' },
    { id: 'skipped-dhikr', title: 'Skipped daily dhikr', category_id: 'quran', type: 'IMPROVE', emoji: '📿' },
    { id: 'read-without-understanding', title: 'Read without understanding', category_id: 'quran', type: 'IMPROVE', emoji: '❓' },
    { id: 'didnt-act-on-quran', title: 'Didn\'t act on what I read', category_id: 'quran', type: 'IMPROVE', emoji: '📖' },
    { id: 'missed-ayat-kursi', title: 'Missed Ayat al-Kursi', category_id: 'quran', type: 'IMPROVE', emoji: '📿' },
    { id: 'forgot-sleep-dhikr', title: 'Forgot sleep adhkar', category_id: 'quran', type: 'IMPROVE', emoji: '🌙' },
    { id: 'forgot-eating-dhikr', title: 'Forgot eating/drinking dhikr', category_id: 'quran', type: 'IMPROVE', emoji: '🍽️' },
    { id: 'forgot-entering-home-dhikr', title: 'Forgot entering home dhikr', category_id: 'quran', type: 'IMPROVE', emoji: '🏠' },
    { id: 'forgot-bathroom-dua', title: 'Forgot bathroom dua', category_id: 'quran', type: 'IMPROVE', emoji: '🚽' },
    { id: 'no-istighfar', title: 'Didn\'t seek forgiveness', category_id: 'quran', type: 'IMPROVE', emoji: '🤲' },
    { id: 'no-salawat', title: 'Didn\'t send blessings on Prophet', category_id: 'quran', type: 'IMPROVE', emoji: '💚' },
    { id: 'quran-on-floor', title: 'Left Quran improperly', category_id: 'quran', type: 'IMPROVE', emoji: '📖' },
    { id: 'talked-during-quran', title: 'Talked during Quran recitation', category_id: 'quran', type: 'IMPROVE', emoji: '🗣️' },
    { id: 'didnt-seek-refuge', title: 'Forgot A\'udhu before Quran', category_id: 'quran', type: 'IMPROVE', emoji: '🛡️' },
    { id: 'no-basmala', title: 'Forgot Bismillah', category_id: 'quran', type: 'IMPROVE', emoji: '🤲' },
    { id: 'forgot-travel-dhikr', title: 'Forgot travel dhikr', category_id: 'quran', type: 'IMPROVE', emoji: '🚗' },
    
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
    
    // Character & Akhlaq - IMPROVE (Massively Expanded - 150+ items)
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
    { id: 'eye-service', title: 'Showed off for people (riya)', category_id: 'character', type: 'IMPROVE', emoji: '👁️' },
    { id: 'stared-inappropriately', title: 'Didn\'t lower gaze', category_id: 'character', type: 'IMPROVE', emoji: '👀' },
    { id: 'wasted-speech', title: 'Wasted time in useless talk', category_id: 'character', type: 'IMPROVE', emoji: '💬' },
    { id: 'didnt-fulfill-trust', title: 'Didn\'t fulfill trust (amanah)', category_id: 'character', type: 'IMPROVE', emoji: '⚠️' },
    { id: 'selfish-behavior', title: 'Acted selfishly', category_id: 'character', type: 'IMPROVE', emoji: '🤷' },
    { id: 'passive-aggressive', title: 'Passive aggressive behavior', category_id: 'character', type: 'IMPROVE', emoji: '😒' },
    { id: 'ignored-advice', title: 'Ignored good advice', category_id: 'character', type: 'IMPROVE', emoji: '🙅' },
    { id: 'disrespected-elder', title: 'Disrespected elder', category_id: 'character', type: 'IMPROVE', emoji: '😤' },
    { id: 'unkind-to-animals', title: 'Unkind to animals', category_id: 'character', type: 'IMPROVE', emoji: '🐾' },
    { id: 'hypocrisy', title: 'Acted hypocritically', category_id: 'character', type: 'IMPROVE', emoji: '🎭' },
    { id: 'bad-thoughts-muslim', title: 'Bad thoughts about fellow Muslim', category_id: 'character', type: 'IMPROVE', emoji: '💭' },
    { id: 'sarcastic-hurtful', title: 'Used hurtful sarcasm', category_id: 'character', type: 'IMPROVE', emoji: '😏' },
    { id: 'didnt-advise', title: 'Didn\'t give advice when needed', category_id: 'character', type: 'IMPROVE', emoji: '🤐' },
    { id: 'bad-advised', title: 'Gave bad advice', category_id: 'character', type: 'IMPROVE', emoji: '❌' },
    { id: 'cheated', title: 'Cheated someone', category_id: 'character', type: 'IMPROVE', emoji: '🃏' },
    { id: 'deceived', title: 'Deceived someone', category_id: 'character', type: 'IMPROVE', emoji: '🎭' },
    { id: 'manipulated', title: 'Manipulated situation', category_id: 'character', type: 'IMPROVE', emoji: '🎪' },
    { id: 'spread-rumor', title: 'Spread rumor/unverified info', category_id: 'character', type: 'IMPROVE', emoji: '📢' },
    { id: 'slandered', title: 'Slandered someone', category_id: 'character', type: 'IMPROVE', emoji: '🗣️' },
    { id: 'cursed', title: 'Cursed/swore', category_id: 'character', type: 'IMPROVE', emoji: '🤬' },
    { id: 'vulgar-speech', title: 'Used vulgar language', category_id: 'character', type: 'IMPROVE', emoji: '💢' },
    { id: 'loud-voice', title: 'Spoke too loudly', category_id: 'character', type: 'IMPROVE', emoji: '📢' },
    { id: 'interrupted', title: 'Interrupted others', category_id: 'character', type: 'IMPROVE', emoji: '🚫' },
    { id: 'didnt-listen', title: 'Didn\'t listen properly', category_id: 'character', type: 'IMPROVE', emoji: '👂' },
    { id: 'dismissive', title: 'Dismissed others\' feelings', category_id: 'character', type: 'IMPROVE', emoji: '🙄' },
    { id: 'greed', title: 'Showed greed', category_id: 'character', type: 'IMPROVE', emoji: '🤑' },
    { id: 'covetousness', title: 'Coveted others\' possessions', category_id: 'character', type: 'IMPROVE', emoji: '👀' },
    { id: 'stinginess-knowledge', title: 'Stingy with knowledge', category_id: 'character', type: 'IMPROVE', emoji: '🤐' },
    { id: 'showed-favoritism', title: 'Showed favoritism/bias', category_id: 'character', type: 'IMPROVE', emoji: '⚖️' },
    { id: 'prejudiced', title: 'Acted with prejudice', category_id: 'character', type: 'IMPROVE', emoji: '🚫' },
    { id: 'judged-appearance', title: 'Judged by appearance', category_id: 'character', type: 'IMPROVE', emoji: '👁️' },
    { id: 'stereotyped', title: 'Stereotyped someone', category_id: 'character', type: 'IMPROVE', emoji: '📦' },
    { id: 'blamed-others', title: 'Blamed others for my mistakes', category_id: 'character', type: 'IMPROVE', emoji: '👉' },
    { id: 'no-accountability', title: 'Didn\'t take accountability', category_id: 'character', type: 'IMPROVE', emoji: '🤷' },
    { id: 'defensive', title: 'Got defensive', category_id: 'character', type: 'IMPROVE', emoji: '🛡️' },
    { id: 'argumentative', title: 'Was argumentative', category_id: 'character', type: 'IMPROVE', emoji: '⚔️' },
    { id: 'stubborn', title: 'Stubbornness', category_id: 'character', type: 'IMPROVE', emoji: '🪨' },
    { id: 'didnt-apologize', title: 'Refused to apologize', category_id: 'character', type: 'IMPROVE', emoji: '🙅' },
    { id: 'insincere-apology', title: 'Gave insincere apology', category_id: 'character', type: 'IMPROVE', emoji: '🎭' },
    { id: 'didnt-forgive', title: 'Refused to forgive', category_id: 'character', type: 'IMPROVE', emoji: '💔' },
    { id: 'held-grudge-long', title: 'Held grudge over 3 days', category_id: 'character', type: 'IMPROVE', emoji: '📅' },
    { id: 'revenge-thoughts', title: 'Thoughts of revenge', category_id: 'character', type: 'IMPROVE', emoji: '⚔️' },
    { id: 'celebrated-others-misfortune', title: 'Celebrated others\' misfortune', category_id: 'character', type: 'IMPROVE', emoji: '😈' },
    { id: 'didnt-congratulate', title: 'Didn\'t congratulate achievement', category_id: 'character', type: 'IMPROVE', emoji: '🙅' },
    { id: 'jealous-success', title: 'Jealous of others\' success', category_id: 'character', type: 'IMPROVE', emoji: '😒' },
    { id: 'hasad', title: 'Evil eye/destructive envy', category_id: 'character', type: 'IMPROVE', emoji: '👁️' },
    { id: 'self-pity', title: 'Excessive self-pity', category_id: 'character', type: 'IMPROVE', emoji: '😢' },
    { id: 'victim-mentality', title: 'Victim mentality', category_id: 'character', type: 'IMPROVE', emoji: '🎯' },
    { id: 'entitled-attitude', title: 'Acted entitled', category_id: 'character', type: 'IMPROVE', emoji: '👑' },
    { id: 'looked-down', title: 'Looked down on someone', category_id: 'character', type: 'IMPROVE', emoji: '👃' },
    { id: 'boasted-wealth', title: 'Boasted about wealth', category_id: 'character', type: 'IMPROVE', emoji: '💰' },
    { id: 'boasted-knowledge', title: 'Boasted about knowledge', category_id: 'character', type: 'IMPROVE', emoji: '🧠' },
    { id: 'boasted-lineage', title: 'Boasted about lineage/status', category_id: 'character', type: 'IMPROVE', emoji: '👑' },
    { id: 'racism', title: 'Racist thoughts/actions', category_id: 'character', type: 'IMPROVE', emoji: '🚫' },
    { id: 'tribalism', title: 'Tribal/nationalist pride', category_id: 'character', type: 'IMPROVE', emoji: '🚩' },
    { id: 'sectarianism', title: 'Sectarian behavior', category_id: 'character', type: 'IMPROVE', emoji: '⚔️' },
    
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
    
    // Family & Relations - IMPROVE (Expanded)
    { id: 'family-neglect', title: 'Neglected family', category_id: 'family', type: 'IMPROVE', emoji: '😔' },
    { id: 'argued-family', title: 'Argued with family', category_id: 'family', type: 'IMPROVE', emoji: '😠' },
    { id: 'ignored-spouse', title: 'Ignored spouse', category_id: 'family', type: 'IMPROVE', emoji: '😶' },
    { id: 'impatient-children', title: 'Impatient with children', category_id: 'family', type: 'IMPROVE', emoji: '😤' },
    { id: 'didnt-call-parents', title: 'Didn\'t contact parents', category_id: 'family', type: 'IMPROVE', emoji: '📵' },
    { id: 'broke-promise-family', title: 'Broke promise to family', category_id: 'family', type: 'IMPROVE', emoji: '💔' },
    { id: 'yelled-at-family', title: 'Yelled at family member', category_id: 'family', type: 'IMPROVE', emoji: '📢' },
    { id: 'compared-children', title: 'Compared children negatively', category_id: 'family', type: 'IMPROVE', emoji: '👶' },
    { id: 'disrespected-parents', title: 'Disrespected parents', category_id: 'family', type: 'IMPROVE', emoji: '👨‍👩‍👦' },
    { id: 'didnt-help-household', title: 'Didn\'t help with chores', category_id: 'family', type: 'IMPROVE', emoji: '🏠' },
    { id: 'canceled-family-time', title: 'Canceled family time', category_id: 'family', type: 'IMPROVE', emoji: '❌' },
    { id: 'prioritized-others-over-family', title: 'Prioritized others over family', category_id: 'family', type: 'IMPROVE', emoji: '⚖️' },
    { id: 'didnt-listen-family', title: 'Didn\'t listen to family', category_id: 'family', type: 'IMPROVE', emoji: '🙉' },
    { id: 'harsh-to-spouse', title: 'Harsh to spouse', category_id: 'family', type: 'IMPROVE', emoji: '💔' },
    { id: 'criticized-family-public', title: 'Criticized family in public', category_id: 'family', type: 'IMPROVE', emoji: '📢' },
    { id: 'neglected-wife-rights', title: 'Neglected spouse\'s rights', category_id: 'family', type: 'IMPROVE', emoji: '⚖️' },
    { id: 'didnt-provide-nafaqah', title: 'Delayed family provision', category_id: 'family', type: 'IMPROVE', emoji: '💰' },
    { id: 'cut-family-ties', title: 'Cut family ties', category_id: 'family', type: 'IMPROVE', emoji: '✂️' },
    { id: 'didnt-visit-relatives', title: 'Didn\'t maintain ties of kinship', category_id: 'family', type: 'IMPROVE', emoji: '👨‍👩‍👧‍👦' },
    
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
    
    // Community & Society - IMPROVE (Expanded)
    { id: 'backbiting', title: 'Backbiting/gossip', category_id: 'community', type: 'IMPROVE', emoji: '🗣️' },
    { id: 'judging-others', title: 'Judging others', category_id: 'community', type: 'IMPROVE', emoji: '👁️' },
    { id: 'ignored-greeting', title: 'Ignored neighbor\'s greeting', category_id: 'community', type: 'IMPROVE', emoji: '😶' },
    { id: 'didnt-help-asked', title: 'Didn\'t help when asked', category_id: 'community', type: 'IMPROVE', emoji: '🙅' },
    { id: 'avoided-visiting-sick', title: 'Avoided visiting sick/elderly', category_id: 'community', type: 'IMPROVE', emoji: '🏥' },
    { id: 'rude-service-worker', title: 'Rude to service worker', category_id: 'community', type: 'IMPROVE', emoji: '😤' },
    { id: 'didnt-reconcile', title: 'Didn\'t reconcile after argument', category_id: 'community', type: 'IMPROVE', emoji: '💔' },
    { id: 'listened-backbiting', title: 'Listened to backbiting', category_id: 'community', type: 'IMPROVE', emoji: '👂' },
    { id: 'spread-secrets', title: 'Spread someone\'s secret', category_id: 'community', type: 'IMPROVE', emoji: '🤐' },
    { id: 'didnt-return-salam', title: 'Didn\'t return salam', category_id: 'community', type: 'IMPROVE', emoji: '🤝' },
    { id: 'broke-boycott', title: 'Broke ties for 3+ days', category_id: 'community', type: 'IMPROVE', emoji: '📅' },
    { id: 'didnt-visit-sick', title: 'Didn\'t visit sick when able', category_id: 'community', type: 'IMPROVE', emoji: '🏥' },
    { id: 'didnt-attend-funeral', title: 'Didn\'t attend funeral when able', category_id: 'community', type: 'IMPROVE', emoji: '⚰️' },
    { id: 'mocked-muslim', title: 'Mocked fellow Muslim', category_id: 'community', type: 'IMPROVE', emoji: '😏' },
    { id: 'exposed-fault', title: 'Exposed someone\'s fault', category_id: 'community', type: 'IMPROVE', emoji: '👁️' },
    { id: 'didnt-defend-muslim', title: 'Didn\'t defend Muslim\'s honor', category_id: 'community', type: 'IMPROVE', emoji: '🛡️' },
    { id: 'hurt-neighbor', title: 'Hurt/annoyed neighbor', category_id: 'community', type: 'IMPROVE', emoji: '🏠' },
    { id: 'loud-noise', title: 'Made loud noise disturbing others', category_id: 'community', type: 'IMPROVE', emoji: '🔊' },
    { id: 'blocked-path', title: 'Blocked path/doorway', category_id: 'community', type: 'IMPROVE', emoji: '🚪' },
    { id: 'didnt-share-knowledge', title: 'Withheld beneficial knowledge', category_id: 'community', type: 'IMPROVE', emoji: '🤐' },
    
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
    
    // Digital & Media - IMPROVE (Expanded)
    { id: 'excessive-social-media', title: 'Excessive social media', category_id: 'digital', type: 'IMPROVE', emoji: '📱' },
    { id: 'inappropriate-content', title: 'Inappropriate content', category_id: 'digital', type: 'IMPROVE', emoji: '👁️' },
    { id: 'endless-scrolling', title: 'Endless scrolling', category_id: 'digital', type: 'IMPROVE', emoji: '📱' },
    { id: 'phone-during-family-time', title: 'Used phone during family time', category_id: 'digital', type: 'IMPROVE', emoji: '📱' },
    { id: 'compared-to-social-media', title: 'Compared life to social media', category_id: 'digital', type: 'IMPROVE', emoji: '📱' },
    { id: 'neglected-real-relationships', title: 'Neglected real relationships for online', category_id: 'digital', type: 'IMPROVE', emoji: '💔' },
    { id: 'watched-haram', title: 'Watched haram content', category_id: 'digital', type: 'IMPROVE', emoji: '👁️' },
    { id: 'listened-haram-music', title: 'Listened to inappropriate music', category_id: 'digital', type: 'IMPROVE', emoji: '🎵' },
    { id: 'shared-inappropriate', title: 'Shared inappropriate content', category_id: 'digital', type: 'IMPROVE', emoji: '📤' },
    { id: 'online-argument', title: 'Got into online argument', category_id: 'digital', type: 'IMPROVE', emoji: '💬' },
    { id: 'cyberbullying', title: 'Cyberbullying/online harassment', category_id: 'digital', type: 'IMPROVE', emoji: '💻' },
    { id: 'posted-showoff', title: 'Posted to show off', category_id: 'digital', type: 'IMPROVE', emoji: '📸' },
    { id: 'phone-in-mosque', title: 'Used phone in mosque', category_id: 'digital', type: 'IMPROVE', emoji: '🕌' },
    { id: 'posted-without-verification', title: 'Shared without verifying', category_id: 'digital', type: 'IMPROVE', emoji: '📢' },
    { id: 'online-fitnah', title: 'Participated in online fitnah', category_id: 'digital', type: 'IMPROVE', emoji: '🔥' },
    { id: 'wasted-time-gaming', title: 'Wasted time gaming', category_id: 'digital', type: 'IMPROVE', emoji: '🎮' },
    { id: 'online-shopping-excess', title: 'Excessive online shopping', category_id: 'digital', type: 'IMPROVE', emoji: '🛒' },
    { id: 'doom-scrolling-news', title: 'Doom-scrolling news', category_id: 'digital', type: 'IMPROVE', emoji: '📰' },
    
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
    
    // Missed Opportunities for Closeness to Allah (MASSIVELY EXPANDED - 100+ items)
    { id: 'missed-dhikr', title: 'Could have remembered Allah', category_id: 'quran', type: 'MISSED_OPPORTUNITY', emoji: '💭' },
    { id: 'missed-charity', title: 'Could have given charity', category_id: 'charity', type: 'MISSED_OPPORTUNITY', emoji: '🤲' },
    { id: 'missed-kindness', title: 'Could have been kinder', category_id: 'character', type: 'MISSED_OPPORTUNITY', emoji: '💝' },
    { id: 'missed-prayer-focus', title: 'Could have prayed with more focus', category_id: 'prayer', type: 'MISSED_OPPORTUNITY', emoji: '🎯' },
    { id: 'missed-gratitude', title: 'Could have been more grateful', category_id: 'character', type: 'MISSED_OPPORTUNITY', emoji: '🙏' },
    { id: 'missed-patience-opportunity', title: 'Missed chance to be patient', category_id: 'character', type: 'MISSED_OPPORTUNITY', emoji: '😌' },
    { id: 'missed-helping-someone', title: 'Could have helped someone', category_id: 'community', type: 'MISSED_OPPORTUNITY', emoji: '🤝' },
    { id: 'missed-smile', title: 'Could have smiled at someone', category_id: 'character', type: 'MISSED_OPPORTUNITY', emoji: '😊' },
    { id: 'missed-salam', title: 'Could have given salam first', category_id: 'community', type: 'MISSED_OPPORTUNITY', emoji: '👋' },
    { id: 'missed-dua-opportunity', title: 'Missed dua opportunity', category_id: 'prayer', type: 'MISSED_OPPORTUNITY', emoji: '🤲' },
    { id: 'missed-tahajjud-chance', title: 'Could have prayed tahajjud', category_id: 'prayer', type: 'MISSED_OPPORTUNITY', emoji: '🌙' },
    { id: 'missed-quran-reflection', title: 'Could have reflected on Quran', category_id: 'quran', type: 'MISSED_OPPORTUNITY', emoji: '📖' },
    { id: 'missed-visiting-sick', title: 'Could have visited sick person', category_id: 'community', type: 'MISSED_OPPORTUNITY', emoji: '🏥' },
    { id: 'missed-parent-service', title: 'Could have served parents better', category_id: 'family', type: 'MISSED_OPPORTUNITY', emoji: '👨‍👩‍👦' },
    { id: 'missed-seeking-knowledge', title: 'Could have sought knowledge', category_id: 'study', type: 'MISSED_OPPORTUNITY', emoji: '📚' },
    { id: 'missed-sadaqah-jariyah', title: 'Could have done continuous charity', category_id: 'charity', type: 'MISSED_OPPORTUNITY', emoji: '🌊' },
    { id: 'missed-teaching-child', title: 'Could have taught child about Islam', category_id: 'family', type: 'MISSED_OPPORTUNITY', emoji: '👨‍🏫' },
    { id: 'missed-dawah-opportunity', title: 'Could have shared Islam', category_id: 'community', type: 'MISSED_OPPORTUNITY', emoji: '💬' },
    { id: 'missed-reconciliation', title: 'Could have made peace', category_id: 'community', type: 'MISSED_OPPORTUNITY', emoji: '🕊️' },
    { id: 'missed-forgiveness', title: 'Could have forgiven', category_id: 'character', type: 'MISSED_OPPORTUNITY', emoji: '💚' },
    { id: 'missed-duha-prayer', title: 'Could have prayed Duha', category_id: 'prayer', type: 'MISSED_OPPORTUNITY', emoji: '☀️' },
    { id: 'missed-istighfar', title: 'Could have sought forgiveness more', category_id: 'quran', type: 'MISSED_OPPORTUNITY', emoji: '🤲' },
    { id: 'missed-salawat', title: 'Could have sent blessings on Prophet', category_id: 'quran', type: 'MISSED_OPPORTUNITY', emoji: '💚' },
    { id: 'missed-fasting-monday', title: 'Could have fasted Monday/Thursday', category_id: 'prayer', type: 'MISSED_OPPORTUNITY', emoji: '📅' },
    { id: 'missed-feeding-hungry', title: 'Could have fed hungry person', category_id: 'charity', type: 'MISSED_OPPORTUNITY', emoji: '🍽️' },
    { id: 'missed-removing-harm', title: 'Could have removed harm from path', category_id: 'character', type: 'MISSED_OPPORTUNITY', emoji: '🧹' },
    { id: 'missed-good-word', title: 'Could have spoken good word', category_id: 'character', type: 'MISSED_OPPORTUNITY', emoji: '💬' },
    { id: 'missed-concealing-fault', title: 'Could have concealed someone\'s fault', category_id: 'character', type: 'MISSED_OPPORTUNITY', emoji: '🤐' },
    { id: 'missed-visiting-relative', title: 'Could have visited relative', category_id: 'family', type: 'MISSED_OPPORTUNITY', emoji: '👨‍👩‍👧‍👦' },
    { id: 'missed-thanking-someone', title: 'Could have thanked someone', category_id: 'character', type: 'MISSED_OPPORTUNITY', emoji: '🙏' },
    { id: 'missed-advice', title: 'Could have given sincere advice', category_id: 'community', type: 'MISSED_OPPORTUNITY', emoji: '💬' },
    { id: 'missed-reading-quran', title: 'Could have read more Quran', category_id: 'quran', type: 'MISSED_OPPORTUNITY', emoji: '📖' },
    { id: 'missed-memorization', title: 'Could have memorized Quran', category_id: 'quran', type: 'MISSED_OPPORTUNITY', emoji: '🧠' },
    { id: 'missed-night-prayer', title: 'Could have prayed at night', category_id: 'prayer', type: 'MISSED_OPPORTUNITY', emoji: '🌙' },
    { id: 'missed-congregation', title: 'Could have prayed in congregation', category_id: 'prayer', type: 'MISSED_OPPORTUNITY', emoji: '👥' },
    { id: 'missed-mosque-attendance', title: 'Could have attended mosque', category_id: 'prayer', type: 'MISSED_OPPORTUNITY', emoji: '🕌' },
    { id: 'missed-friday-early', title: 'Could have gone early to Jumuah', category_id: 'prayer', type: 'MISSED_OPPORTUNITY', emoji: '⏰' },
    { id: 'missed-adhan-response', title: 'Could have responded to adhan properly', category_id: 'prayer', type: 'MISSED_OPPORTUNITY', emoji: '📢' },
    { id: 'missed-tahiyyatul-masjid', title: 'Could have prayed tahiyyat al-masjid', category_id: 'prayer', type: 'MISSED_OPPORTUNITY', emoji: '🕌' },
    { id: 'missed-sunnah-prayers', title: 'Could have prayed sunnah', category_id: 'prayer', type: 'MISSED_OPPORTUNITY', emoji: '🤲' },
    { id: 'missed-witr', title: 'Could have prayed witr', category_id: 'prayer', type: 'MISSED_OPPORTUNITY', emoji: '🌙' },
    { id: 'missed-post-salah-dhikr', title: 'Could have done post-prayer dhikr', category_id: 'quran', type: 'MISSED_OPPORTUNITY', emoji: '📿' },
    { id: 'missed-morning-adhkar', title: 'Could have done morning adhkar', category_id: 'quran', type: 'MISSED_OPPORTUNITY', emoji: '🌅' },
    { id: 'missed-evening-adhkar', title: 'Could have done evening adhkar', category_id: 'quran', type: 'MISSED_OPPORTUNITY', emoji: '🌇' },
    { id: 'missed-sleep-adhkar', title: 'Could have done sleep adhkar', category_id: 'quran', type: 'MISSED_OPPORTUNITY', emoji: '😴' },
    { id: 'missed-travel-dua', title: 'Could have made travel dua', category_id: 'quran', type: 'MISSED_OPPORTUNITY', emoji: '🚗' },
    { id: 'missed-entering-home-dua', title: 'Could have made entering home dua', category_id: 'quran', type: 'MISSED_OPPORTUNITY', emoji: '🏠' },
    { id: 'missed-eating-dua', title: 'Could have made eating dua', category_id: 'quran', type: 'MISSED_OPPORTUNITY', emoji: '🍽️' },
    { id: 'missed-waking-dua', title: 'Could have made waking dua', category_id: 'quran', type: 'MISSED_OPPORTUNITY', emoji: '😊' },
    { id: 'missed-bathroom-dua', title: 'Could have made bathroom dua', category_id: 'quran', type: 'MISSED_OPPORTUNITY', emoji: '🚽' },
    { id: 'missed-weather-dua', title: 'Could have made weather dua', category_id: 'quran', type: 'MISSED_OPPORTUNITY', emoji: '⛅' },
    { id: 'missed-giving-sadaqah', title: 'Could have given more charity', category_id: 'charity', type: 'MISSED_OPPORTUNITY', emoji: '💝' },
    { id: 'missed-zakat-opportunity', title: 'Could have purified wealth', category_id: 'charity', type: 'MISSED_OPPORTUNITY', emoji: '💰' },
    { id: 'missed-feeding-needy', title: 'Could have fed needy person', category_id: 'charity', type: 'MISSED_OPPORTUNITY', emoji: '🤲' },
    { id: 'missed-water-charity', title: 'Could have provided water', category_id: 'charity', type: 'MISSED_OPPORTUNITY', emoji: '💧' },
    { id: 'missed-sponsoring-orphan', title: 'Could have helped orphan', category_id: 'charity', type: 'MISSED_OPPORTUNITY', emoji: '👶' },
    { id: 'missed-sharing-knowledge', title: 'Could have shared knowledge', category_id: 'study', type: 'MISSED_OPPORTUNITY', emoji: '📚' },
    { id: 'missed-islamic-lecture', title: 'Could have attended lecture', category_id: 'study', type: 'MISSED_OPPORTUNITY', emoji: '🎓' },
    { id: 'missed-learning-hadith', title: 'Could have studied hadith', category_id: 'study', type: 'MISSED_OPPORTUNITY', emoji: '📜' },
    { id: 'missed-learning-seerah', title: 'Could have studied Prophet\'s life', category_id: 'study', type: 'MISSED_OPPORTUNITY', emoji: '📖' },
    { id: 'missed-learning-fiqh', title: 'Could have learned fiqh', category_id: 'study', type: 'MISSED_OPPORTUNITY', emoji: '⚖️' },
    { id: 'missed-arabic-learning', title: 'Could have practiced Arabic', category_id: 'study', type: 'MISSED_OPPORTUNITY', emoji: '🔤' },
    { id: 'missed-spouse-kindness', title: 'Could have been kinder to spouse', category_id: 'family', type: 'MISSED_OPPORTUNITY', emoji: '💕' },
    { id: 'missed-children-quality-time', title: 'Could have spent quality time with children', category_id: 'family', type: 'MISSED_OPPORTUNITY', emoji: '👶' },
    { id: 'missed-parent-dua', title: 'Could have made dua for parents', category_id: 'family', type: 'MISSED_OPPORTUNITY', emoji: '🤲' },
    { id: 'missed-family-meal', title: 'Could have eaten together', category_id: 'family', type: 'MISSED_OPPORTUNITY', emoji: '🍽️' },
    { id: 'missed-listening-family', title: 'Could have listened better to family', category_id: 'family', type: 'MISSED_OPPORTUNITY', emoji: '👂' },
    { id: 'missed-helping-neighbor', title: 'Could have helped neighbor', category_id: 'community', type: 'MISSED_OPPORTUNITY', emoji: '🏠' },
    { id: 'missed-greeting-warmly', title: 'Could have greeted more warmly', category_id: 'community', type: 'MISSED_OPPORTUNITY', emoji: '👋' },
    { id: 'missed-comforting-sad', title: 'Could have comforted sad person', category_id: 'community', type: 'MISSED_OPPORTUNITY', emoji: '🤗' },
    { id: 'missed-defending-honor', title: 'Could have defended someone\'s honor', category_id: 'community', type: 'MISSED_OPPORTUNITY', emoji: '🛡️' },
    { id: 'missed-stopping-munkar', title: 'Could have forbade wrong', category_id: 'community', type: 'MISSED_OPPORTUNITY', emoji: '🚫' },
    { id: 'missed-enjoining-good', title: 'Could have enjoined good', category_id: 'community', type: 'MISSED_OPPORTUNITY', emoji: '✅' },
    { id: 'missed-funeral-attendance', title: 'Could have attended funeral', category_id: 'community', type: 'MISSED_OPPORTUNITY', emoji: '⚰️' },
    { id: 'missed-wedding-attendance', title: 'Could have attended wedding', category_id: 'community', type: 'MISSED_OPPORTUNITY', emoji: '💍' },
    { id: 'missed-giving-gift', title: 'Could have given gift', category_id: 'community', type: 'MISSED_OPPORTUNITY', emoji: '🎁' },
    { id: 'missed-making-peace', title: 'Could have reconciled people', category_id: 'community', type: 'MISSED_OPPORTUNITY', emoji: '🕊️' },
    { id: 'missed-controlling-anger', title: 'Could have controlled anger', category_id: 'character', type: 'MISSED_OPPORTUNITY', emoji: '🧘' },
    { id: 'missed-lowering-gaze', title: 'Could have lowered gaze', category_id: 'character', type: 'MISSED_OPPORTUNITY', emoji: '👀' },
    { id: 'missed-gentle-speech', title: 'Could have spoken more gently', category_id: 'character', type: 'MISSED_OPPORTUNITY', emoji: '💬' },
    { id: 'missed-truthfulness', title: 'Could have been more truthful', category_id: 'character', type: 'MISSED_OPPORTUNITY', emoji: '💯' },
    { id: 'missed-keeping-promise', title: 'Could have kept promise better', category_id: 'character', type: 'MISSED_OPPORTUNITY', emoji: '✅' },
    { id: 'missed-showing-mercy', title: 'Could have shown more mercy', category_id: 'character', type: 'MISSED_OPPORTUNITY', emoji: '💚' },
    { id: 'missed-humility', title: 'Could have been more humble', category_id: 'character', type: 'MISSED_OPPORTUNITY', emoji: '🙇' },
    { id: 'missed-controlling-tongue', title: 'Could have controlled tongue better', category_id: 'character', type: 'MISSED_OPPORTUNITY', emoji: '👅' },
    { id: 'missed-good-thoughts', title: 'Could have thought better of someone', category_id: 'character', type: 'MISSED_OPPORTUNITY', emoji: '💭' },
    { id: 'missed-justice', title: 'Could have been more just', category_id: 'character', type: 'MISSED_OPPORTUNITY', emoji: '⚖️' },
    { id: 'missed-trustworthiness', title: 'Could have been more trustworthy', category_id: 'character', type: 'MISSED_OPPORTUNITY', emoji: '🤝' },
    { id: 'missed-contentment', title: 'Could have been more content', category_id: 'character', type: 'MISSED_OPPORTUNITY', emoji: '😌' },
    { id: 'missed-tawakkul', title: 'Could have trusted Allah more', category_id: 'character', type: 'MISSED_OPPORTUNITY', emoji: '🤲' },
    { id: 'missed-sincerity', title: 'Could have been more sincere', category_id: 'character', type: 'MISSED_OPPORTUNITY', emoji: '💚' },
    { id: 'missed-ihsan', title: 'Could have done with more excellence', category_id: 'character', type: 'MISSED_OPPORTUNITY', emoji: '✨' },
    { id: 'missed-animal-kindness', title: 'Could have been kinder to animal', category_id: 'character', type: 'MISSED_OPPORTUNITY', emoji: '🐾' },
    { id: 'missed-environmental-care', title: 'Could have cared for environment', category_id: 'environment', type: 'MISSED_OPPORTUNITY', emoji: '🌿' },
    { id: 'missed-conserving-water', title: 'Could have conserved water', category_id: 'environment', type: 'MISSED_OPPORTUNITY', emoji: '💧' },
    { id: 'missed-avoiding-waste', title: 'Could have avoided waste', category_id: 'environment', type: 'MISSED_OPPORTUNITY', emoji: '♻️' },
    { id: 'missed-planting-tree', title: 'Could have planted something', category_id: 'environment', type: 'MISSED_OPPORTUNITY', emoji: '🌱' },
    { id: 'missed-productive-time', title: 'Could have used time better', category_id: 'time', type: 'MISSED_OPPORTUNITY', emoji: '⏰' },
    { id: 'missed-early-sleep', title: 'Could have slept earlier', category_id: 'time', type: 'MISSED_OPPORTUNITY', emoji: '😴' },
    { id: 'missed-planning', title: 'Could have planned better', category_id: 'time', type: 'MISSED_OPPORTUNITY', emoji: '📋' },
    { id: 'missed-prioritizing', title: 'Could have prioritized better', category_id: 'time', type: 'MISSED_OPPORTUNITY', emoji: '🎯' },
    { id: 'missed-exercise', title: 'Could have exercised', category_id: 'health', type: 'MISSED_OPPORTUNITY', emoji: '🏃' },
    { id: 'missed-healthy-eating', title: 'Could have eaten healthier', category_id: 'health', type: 'MISSED_OPPORTUNITY', emoji: '🥗' },
    { id: 'missed-body-care', title: 'Could have taken better care of body', category_id: 'health', type: 'MISSED_OPPORTUNITY', emoji: '🌱' },
    { id: 'missed-mental-health-care', title: 'Could have cared for mental health', category_id: 'emotions', type: 'MISSED_OPPORTUNITY', emoji: '🧠' },
    
    // WORKPLACE ETHICS - GOOD
    { 
      id: 'honest-work', 
      title: 'Performed honest work', 
      category_id: 'workplace', 
      type: 'GOOD', 
      emoji: '💼',
      scenario: 'workplace',
      difficulty: 'beginner',
      frequency: 'daily',
      reward_description: 'Halal income, barakah in earnings'
    },
    { 
      id: 'helped-colleague', 
      title: 'Helped colleague', 
      category_id: 'workplace', 
      type: 'GOOD', 
      emoji: '🤝',
      scenario: 'workplace',
      difficulty: 'beginner',
      frequency: 'situational'
    },
    { 
      id: 'ethical-business', 
      title: 'Conducted ethical business', 
      category_id: 'workplace', 
      type: 'GOOD', 
      emoji: '⚖️',
      scenario: 'workplace',
      difficulty: 'intermediate',
      frequency: 'daily',
      hadith_reference: 'Sunan Ibn Majah 2146'
    },
    { 
      id: 'rejected-bribe', 
      title: 'Rejected bribery/corruption', 
      category_id: 'workplace', 
      type: 'GOOD', 
      emoji: '🚫',
      scenario: 'workplace',
      difficulty: 'advanced',
      frequency: 'situational',
      reward_description: 'Protected honor and integrity'
    },
    { 
      id: 'quality-work', 
      title: 'Did quality work', 
      category_id: 'workplace', 
      type: 'GOOD', 
      emoji: '✨',
      scenario: 'workplace',
      difficulty: 'intermediate',
      frequency: 'daily',
      hadith_reference: 'Al-Bayhaqi 334'
    },
    
    // WORKPLACE ETHICS - IMPROVE
    { id: 'workplace-gossip', title: 'Engaged in workplace gossip', category_id: 'workplace', type: 'IMPROVE', emoji: '🗣️', scenario: 'workplace', difficulty: 'intermediate' },
    { id: 'lazy-work', title: 'Lazy at work', category_id: 'workplace', type: 'IMPROVE', emoji: '😴', scenario: 'workplace', difficulty: 'beginner' },
    { id: 'dishonest-work', title: 'Dishonest in work', category_id: 'workplace', type: 'IMPROVE', emoji: '❌', scenario: 'workplace', difficulty: 'beginner' },
    
    // TRAVEL & JOURNEY - GOOD
    { 
      id: 'prayed-while-traveling', 
      title: 'Maintained prayer while traveling', 
      category_id: 'travel-journey', 
      type: 'GOOD', 
      emoji: '🕌',
      scenario: 'travel',
      difficulty: 'intermediate',
      frequency: 'situational',
      reward_description: 'Maintained connection with Allah'
    },
    { 
      id: 'shared-islam-traveler', 
      title: 'Shared Islam with traveler', 
      category_id: 'travel-journey', 
      type: 'GOOD', 
      emoji: '💬',
      scenario: 'travel',
      difficulty: 'advanced',
      frequency: 'situational'
    },
    { 
      id: 'patient-in-travel', 
      title: 'Patient during travel delays', 
      category_id: 'travel-journey', 
      type: 'GOOD', 
      emoji: '😌',
      scenario: 'travel',
      difficulty: 'intermediate',
      frequency: 'situational'
    },
    
    // SOCIAL EVENTS - GOOD
    { 
      id: 'attended-wedding', 
      title: 'Attended wedding invitation', 
      category_id: 'social-events', 
      type: 'GOOD', 
      emoji: '💍',
      scenario: 'social',
      difficulty: 'beginner',
      frequency: 'occasional',
      hadith_reference: 'Sahih Bukhari 5177'
    },
    { 
      id: 'attended-funeral', 
      title: 'Attended funeral', 
      category_id: 'social-events', 
      type: 'GOOD', 
      emoji: '🤲',
      scenario: 'social',
      difficulty: 'intermediate',
      frequency: 'occasional',
      reward_description: 'Following Prophet\'s Sunnah'
    },
    { 
      id: 'islamic-gathering', 
      title: 'Attended Islamic gathering', 
      category_id: 'social-events', 
      type: 'GOOD', 
      emoji: '🕌',
      scenario: 'social',
      difficulty: 'beginner',
      frequency: 'weekly'
    },
    { 
      id: 'avoided-haram-event', 
      title: 'Avoided haram event', 
      category_id: 'social-events', 
      type: 'GOOD', 
      emoji: '🛡️',
      scenario: 'social',
      difficulty: 'advanced',
      frequency: 'situational'
    },
    
    // RAMADAN SPECIAL - GOOD
    { 
      id: 'sahoor', 
      title: 'Ate Sahoor', 
      category_id: 'ramadan', 
      type: 'GOOD', 
      emoji: '🌙',
      difficulty: 'beginner',
      frequency: 'daily',
      hadith_reference: 'Sahih Bukhari 1923'
    },
    { 
      id: 'iftar-others', 
      title: 'Provided Iftar for others', 
      category_id: 'ramadan', 
      type: 'GOOD', 
      emoji: '🍽️',
      difficulty: 'intermediate',
      frequency: 'daily',
      reward_description: 'Reward equal to fasting person'
    },
    { 
      id: 'laylatul-qadr', 
      title: 'Sought Laylatul Qadr', 
      category_id: 'ramadan', 
      type: 'GOOD', 
      emoji: '✨',
      difficulty: 'advanced',
      frequency: 'occasional',
      reward_description: 'Better than 1000 months'
    },
    
    // STUDENT LIFE - GOOD
    { 
      id: 'studied-with-intention', 
      title: 'Studied with Islamic intention', 
      category_id: 'student-life', 
      type: 'GOOD', 
      emoji: '📚',
      scenario: 'study',
      difficulty: 'intermediate',
      frequency: 'daily'
    },
    { 
      id: 'helped-classmate', 
      title: 'Helped struggling classmate', 
      category_id: 'student-life', 
      type: 'GOOD', 
      emoji: '🤝',
      scenario: 'study',
      difficulty: 'beginner',
      frequency: 'situational'
    },
    { 
      id: 'academic-honesty', 
      title: 'Maintained academic honesty', 
      category_id: 'student-life', 
      type: 'GOOD', 
      emoji: '✅',
      scenario: 'study',
      difficulty: 'intermediate',
      frequency: 'situational'
    },
    
    // MARRIAGE & FAMILY - GOOD
    { 
      id: 'kind-to-spouse', 
      title: 'Kind to spouse', 
      category_id: 'marriage', 
      type: 'GOOD', 
      emoji: '💑',
      scenario: 'home',
      difficulty: 'beginner',
      frequency: 'daily',
      hadith_reference: 'Sunan Ibn Majah 1977'
    },
    { 
      id: 'marital-intimacy', 
      title: 'Maintained marital bond', 
      category_id: 'marriage', 
      type: 'GOOD', 
      emoji: '💕',
      scenario: 'home',
      difficulty: 'beginner',
      frequency: 'situational',
      reward_description: 'Act of worship when done righteously'
    },
    { 
      id: 'resolved-conflict', 
      title: 'Resolved marital conflict peacefully', 
      category_id: 'marriage', 
      type: 'GOOD', 
      emoji: '🕊️',
      scenario: 'home',
      difficulty: 'advanced',
      frequency: 'situational'
    },
    
    // PARENTING - GOOD
    { 
      id: 'taught-child-islam', 
      title: 'Taught child about Islam', 
      category_id: 'parenting', 
      type: 'GOOD', 
      emoji: '📖',
      scenario: 'home',
      difficulty: 'intermediate',
      frequency: 'daily',
      reward_description: 'Continuous reward (Sadaqah Jariyah)'
    },
    { 
      id: 'patient-with-child', 
      title: 'Patient with child', 
      category_id: 'parenting', 
      type: 'GOOD', 
      emoji: '🤗',
      scenario: 'home',
      difficulty: 'intermediate',
      frequency: 'daily'
    },
    { 
      id: 'prayed-with-child', 
      title: 'Prayed with child', 
      category_id: 'parenting', 
      type: 'GOOD', 
      emoji: '🤲',
      scenario: 'home',
      difficulty: 'beginner',
      frequency: 'daily',
      hadith_reference: 'Abu Dawud 495'
    },
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
