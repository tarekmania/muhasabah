import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Entry, Settings } from '@/types';

// Database schema version - increment when making schema changes
const DB_VERSION = 1;
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
    upgrade(db, oldVersion, newVersion) {
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
 * Save an entry to the database
 */
export async function saveEntry(entry: Entry): Promise<void> {
  const db = await getDB();
  await db.put('entries', entry);
  console.log('Entry saved to IndexedDB:', entry.id);
}

/**
 * Get all entries from the database
 */
export async function getAllEntries(): Promise<Entry[]> {
  const db = await getDB();
  return await db.getAll('entries');
}

/**
 * Get entry by ID
 */
export async function getEntryById(id: string): Promise<Entry | undefined> {
  const db = await getDB();
  return await db.get('entries', id);
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
 * Save settings to the database
 */
export async function saveSettings(settings: Settings): Promise<void> {
  const db = await getDB();
  await db.put('settings', settings, 'app-settings');
  console.log('Settings saved to IndexedDB');
}

/**
 * Get settings from the database
 */
export async function getSettings(): Promise<Settings | undefined> {
  const db = await getDB();
  return await db.get('settings', 'app-settings');
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
 * Import data from JSON backup
 */
export async function importData(jsonData: string): Promise<{ success: boolean; message: string }> {
  try {
    const data = JSON.parse(jsonData);
    
    if (!data.version || !data.entries) {
      return { success: false, message: 'Invalid backup file format' };
    }

    const db = await getDB();
    const tx = db.transaction(['entries', 'settings', 'metadata'], 'readwrite');

    // Clear existing data
    await tx.objectStore('entries').clear();
    await tx.objectStore('settings').clear();

    // Import entries
    for (const entry of data.entries) {
      await tx.objectStore('entries').put(entry);
    }

    // Import settings
    if (data.settings) {
      await tx.objectStore('settings').put(data.settings, 'app-settings');
    }

    // Update metadata
    await tx.objectStore('metadata').put({
      version: DB_VERSION,
      lastSync: new Date().toISOString(),
    }, 'last-import');

    await tx.done;

    console.log('Data imported successfully');
    return { success: true, message: `Imported ${data.entries.length} entries successfully` };
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
