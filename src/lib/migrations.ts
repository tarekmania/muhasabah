import type { Entry, Settings } from '@/types';

export const CURRENT_DB_VERSION = 1;

/**
 * Migration function type
 */
type MigrationFunction = (db: IDBDatabase, transaction: IDBTransaction) => Promise<void>;

/**
 * Data transformer type for upgrading entries/settings
 */
type DataTransformer<T> = (data: any, fromVersion: number) => T;

/**
 * Schema migrations for each version
 * Add new migrations here when bumping DB_VERSION
 */
export const migrations: Record<number, MigrationFunction> = {
  1: async (db, transaction) => {
    // Initial schema - no migration needed
    console.log('Migration v1: Initial schema');
  },
  
  // Example for future version 2:
  // 2: async (db, transaction) => {
  //   const entryStore = transaction.objectStore('entries');
  //   // Add new fields, transform data, etc.
  // },
};

/**
 * Apply migrations in sequence from oldVersion to newVersion
 */
export async function applyMigrations(
  db: IDBDatabase,
  transaction: IDBTransaction,
  oldVersion: number,
  newVersion: number
): Promise<void> {
  console.log(`Applying migrations from v${oldVersion} to v${newVersion}`);
  
  for (let version = oldVersion + 1; version <= newVersion; version++) {
    const migration = migrations[version];
    if (migration) {
      console.log(`Running migration v${version}...`);
      await migration(db, transaction);
      console.log(`Migration v${version} completed`);
    }
  }
}

/**
 * Transform Entry data from older versions to current schema
 */
export const transformEntry: DataTransformer<Entry> = (data: any, fromVersion: number): Entry => {
  // Start with base data
  let entry = { ...data };

  // Apply transformations based on source version
  if (fromVersion < 1) {
    // Handle pre-v1 data if needed
  }

  // Ensure all required fields exist with defaults
  return {
    id: entry.id || `entry-${Date.now()}`,
    dateISO: entry.dateISO || new Date().toISOString().split('T')[0],
    good: entry.good || null,
    improve: entry.improve || null,
    severeSlip: entry.severeSlip,
    missedOpportunity: entry.missedOpportunity,
    dua: entry.dua,
    privacy_level: entry.privacy_level || 'normal',
  };
};

/**
 * Transform Settings data from older versions to current schema
 */
export const transformSettings: DataTransformer<Settings> = (data: any, fromVersion: number): Settings => {
  let settings = { ...data };

  // Apply transformations based on source version
  if (fromVersion < 1) {
    // Handle pre-v1 data if needed
  }

  // Parse reminderTime if it's a string (e.g., "21:00")
  let reminderHour = 21;
  let reminderMinute = 0;
  
  if (typeof settings.reminderTime === 'string') {
    const [h, m] = settings.reminderTime.split(':').map(Number);
    if (!isNaN(h) && !isNaN(m)) {
      reminderHour = h;
      reminderMinute = m;
    }
  } else if (typeof settings.reminderHour === 'number' && typeof settings.reminderMinute === 'number') {
    reminderHour = settings.reminderHour;
    reminderMinute = settings.reminderMinute;
  }

  // Ensure all required fields exist with defaults
  return {
    reminderHour,
    reminderMinute,
    biometricLock: settings.biometricLock ?? false,
    privateMode: settings.privateMode ?? false,
  };
};

/**
 * Check if data is compatible with current version
 */
export function isCompatibleVersion(dataVersion: number): boolean {
  // Allow imports from any version <= current
  return dataVersion > 0 && dataVersion <= CURRENT_DB_VERSION;
}

/**
 * Get safe version number from data
 */
export function getSafeVersion(data: any): number {
  const version = parseInt(data?.version);
  return isNaN(version) || version < 1 ? 1 : version;
}

/**
 * Transform array of entries from older versions
 */
export function transformEntries(entries: any[], fromVersion: number): Entry[] {
  return entries
    .filter(entry => entry && typeof entry === 'object')
    .map(entry => {
      try {
        return transformEntry(entry, fromVersion);
      } catch (error) {
        console.error('Failed to transform entry:', entry, error);
        return null;
      }
    })
    .filter((entry): entry is Entry => entry !== null);
}
