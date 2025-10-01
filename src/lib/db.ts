import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Entry, Settings } from '@/types';
import { CURRENT_DB_VERSION, applyMigrations, transformEntry, transformSettings, transformEntries, getSafeVersion, isCompatibleVersion } from './migrations';
import { validateEntry, validateSettings, validateEntries } from './validators';

// Database schema version - increment when making schema changes
const DB_VERSION = CURRENT_DB_VERSION;
const DB_NAME = 'muhasabah-db';

interface MuhasabahDB extends DBSchema {
  entries: {
    key: string;
    value: Entry;
    indexes: { 'by-date': string };
  };
  settings: {
    key: 'app-settings';
    value: Settings;
  };
  metadata: {
    key: string;
    value: {
      lastSync?: string;
      version: number;
      exportedAt?: string;
    };
  };
}

let dbInstance: IDBPDatabase<MuhasabahDB> | null = null;

/**
 * Initialize and get database instance
 * Implements offline-first persistence with IndexedDB
 */
export async function getDB(): Promise<IDBPDatabase<MuhasabahDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<MuhasabahDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      console.log(`Upgrading database from version ${oldVersion} to ${newVersion}`);
      
      // Create entries store
      if (!db.objectStoreNames.contains('entries')) {
        const entryStore = db.createObjectStore('entries', { keyPath: 'id' });
        entryStore.createIndex('by-date', 'dateISO');
        console.log('Created entries store');
      }

      // Create settings store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings');
        console.log('Created settings store');
      }

      // Create metadata store
      if (!db.objectStoreNames.contains('metadata')) {
        db.createObjectStore('metadata');
        console.log('Created metadata store');
      }

      // Note: Data migrations handled separately via transform functions during import
      if (oldVersion > 0 && newVersion && newVersion > oldVersion) {
        console.log(`Schema upgraded from v${oldVersion} to v${newVersion}`);
      }
    },
    blocked() {
      console.warn('Database blocked - close other tabs with this app');
    },
    blocking() {
      console.warn('Database blocking - new version waiting');
    },
    terminated() {
      console.error('Database connection terminated');
      dbInstance = null;
    },
  });

  return dbInstance;
}

/**
 * Save an entry to the database with validation
 */
export async function saveEntry(entry: Entry): Promise<void> {
  const validation = validateEntry(entry);
  
  if (!validation.isValid) {
    console.warn('Entry validation failed, saving repaired version:', validation.errors);
  }
  
  if (validation.warnings.length > 0) {
    console.warn('Entry warnings:', validation.warnings);
  }

  const db = await getDB();
  await db.put('entries', validation.data);
  console.log('Entry saved to IndexedDB:', validation.data.id, validation.repaired ? '(repaired)' : '');
}

/**
 * Get all entries from the database
 */
export async function getAllEntries(): Promise<Entry[]> {
  const db = await getDB();
  return await db.getAll('entries');
}

/**
 * Get entry by ID with validation
 */
export async function getEntryById(id: string): Promise<Entry | undefined> {
  const db = await getDB();
  const entry = await db.get('entries', id);
  
  if (!entry) return undefined;
  
  const validation = validateEntry(entry);
  
  if (validation.repaired) {
    console.warn('Entry was repaired on read:', id, validation.warnings);
    // Save the repaired version
    await db.put('entries', validation.data);
  }
  
  return validation.data;
}

/**
 * Get entries by date
 */
export async function getEntriesByDate(dateISO: string): Promise<Entry[]> {
  const db = await getDB();
  const index = db.transaction('entries').store.index('by-date');
  return await index.getAll(dateISO);
}

/**
 * Update an entry
 */
export async function updateEntry(entry: Entry): Promise<void> {
  const db = await getDB();
  await db.put('entries', entry);
  console.log('Entry updated in IndexedDB:', entry.id);
}

/**
 * Delete an entry
 */
export async function deleteEntry(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('entries', id);
  console.log('Entry deleted from IndexedDB:', id);
}

/**
 * Save settings to the database with validation
 */
export async function saveSettings(settings: Settings): Promise<void> {
  const validation = validateSettings(settings);
  
  if (!validation.isValid) {
    console.warn('Settings validation failed, saving repaired version:', validation.errors);
  }
  
  if (validation.warnings.length > 0) {
    console.warn('Settings warnings:', validation.warnings);
  }

  const db = await getDB();
  await db.put('settings', validation.data, 'app-settings');
  console.log('Settings saved to IndexedDB', validation.repaired ? '(repaired)' : '');
}

/**
 * Get settings from the database with validation
 */
export async function getSettings(): Promise<Settings | undefined> {
  const db = await getDB();
  const settings = await db.get('settings', 'app-settings');
  
  if (!settings) return undefined;
  
  const validation = validateSettings(settings);
  
  if (validation.repaired) {
    console.warn('Settings were repaired on read:', validation.warnings);
    // Save the repaired version
    await db.put('settings', validation.data, 'app-settings');
  }
  
  return validation.data;
}

/**
 * Clear all data (for panic delete)
 */
export async function clearAllData(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['entries', 'settings', 'metadata'], 'readwrite');
  await Promise.all([
    tx.objectStore('entries').clear(),
    tx.objectStore('settings').clear(),
    tx.objectStore('metadata').clear(),
  ]);
  await tx.done;
  console.log('All data cleared from IndexedDB');
}

/**
 * Export all data as JSON for backup
 */
export async function exportData(): Promise<string> {
  const db = await getDB();
  const entries = await db.getAll('entries');
  const settings = await db.get('settings', 'app-settings');
  
  const exportData = {
    version: DB_VERSION,
    exportedAt: new Date().toISOString(),
    entries,
    settings,
  };

  // Save export metadata
  await db.put('metadata', {
    version: DB_VERSION,
    exportedAt: exportData.exportedAt,
  }, 'last-export');

  return JSON.stringify(exportData, null, 2);
}

/**
 * Import data from JSON backup with version handling and validation
 */
export async function importData(jsonData: string): Promise<{ success: boolean; message: string }> {
  try {
    const data = JSON.parse(jsonData);
    
    if (!data.entries) {
      return { success: false, message: 'Invalid backup file format - missing entries' };
    }

    // Get safe version number
    const sourceVersion = getSafeVersion(data);
    
    // Check version compatibility
    if (!isCompatibleVersion(sourceVersion)) {
      return { 
        success: false, 
        message: `Incompatible backup version: ${sourceVersion}. Please update the app.` 
      };
    }

    console.log(`Importing data from version ${sourceVersion} to ${DB_VERSION}`);

    // Transform and validate entries
    const transformedEntries = transformEntries(data.entries, sourceVersion);
    const entriesValidation = validateEntries(transformedEntries);
    
    if (entriesValidation.invalid > 0) {
      console.warn(`${entriesValidation.invalid} invalid entries were skipped`);
    }
    
    if (entriesValidation.repaired > 0) {
      console.warn(`${entriesValidation.repaired} entries were repaired`);
    }

    // Transform and validate settings
    let validatedSettings: Settings | undefined;
    if (data.settings) {
      const transformed = transformSettings(data.settings, sourceVersion);
      const settingsValidation = validateSettings(transformed);
      validatedSettings = settingsValidation.data;
      
      if (settingsValidation.repaired) {
        console.warn('Settings were repaired during import:', settingsValidation.warnings);
      }
    }

    const db = await getDB();
    const tx = db.transaction(['entries', 'settings', 'metadata'], 'readwrite');

    // Clear existing data
    await tx.objectStore('entries').clear();
    await tx.objectStore('settings').clear();

    // Import validated entries
    for (const entry of entriesValidation.valid) {
      await tx.objectStore('entries').put(entry);
    }

    // Import validated settings
    if (validatedSettings) {
      await tx.objectStore('settings').put(validatedSettings, 'app-settings');
    }

    // Update metadata
    await tx.objectStore('metadata').put({
      version: DB_VERSION,
      lastSync: new Date().toISOString(),
    }, 'last-import');

    await tx.done;

    const message = [
      `Imported ${entriesValidation.valid.length} entries successfully`,
      entriesValidation.invalid > 0 ? `(${entriesValidation.invalid} invalid entries skipped)` : '',
      entriesValidation.repaired > 0 ? `(${entriesValidation.repaired} entries repaired)` : '',
    ].filter(Boolean).join(' ');

    console.log('Data imported successfully:', message);
    return { success: true, message };
  } catch (error) {
    console.error('Import failed:', error);
    return { success: false, message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

/**
 * Get database statistics
 */
export async function getDBStats(): Promise<{
  totalEntries: number;
  oldestEntry?: string;
  newestEntry?: string;
  dbSize?: number;
}> {
  const db = await getDB();
  const entries = await db.getAll('entries');
  
  const stats = {
    totalEntries: entries.length,
    oldestEntry: entries.length > 0 ? entries.sort((a, b) => a.dateISO.localeCompare(b.dateISO))[0].dateISO : undefined,
    newestEntry: entries.length > 0 ? entries.sort((a, b) => b.dateISO.localeCompare(a.dateISO))[0].dateISO : undefined,
  };

  return stats;
}

/**
 * Check if database is initialized and healthy
 */
export async function checkDBHealth(): Promise<boolean> {
  try {
    const db = await getDB();
    // Try a simple operation
    await db.get('settings', 'app-settings');
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}
