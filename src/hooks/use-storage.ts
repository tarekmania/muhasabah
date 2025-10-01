import { useState, useEffect } from 'react';
import { type Entry, type Settings } from '@/types';
import { 
  getDB, 
  getAllEntries, 
  saveEntry as saveEntryToDB, 
  updateEntry as updateEntryInDB,
  saveSettings as saveSettingsToDB,
  getSettings as getSettingsFromDB,
  clearAllData as clearAllDataFromDB,
  checkDBHealth
} from '@/lib/db';

const defaultSettings: Settings = {
  reminderHour: 21,
  reminderMinute: 0,
  biometricLock: false,
  privateMode: false,
};

export function useStorage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [dbHealthy, setDbHealthy] = useState(true);

  // Initialize database and load data
  useEffect(() => {
    const initDB = async () => {
      try {
        console.log('Initializing IndexedDB...');
        
        // Initialize database first
        await getDB();
        
        // Check database health
        const healthy = await checkDBHealth();
        setDbHealthy(healthy);
        
        if (!healthy) {
          console.error('Database health check failed');
          setIsLoading(false);
          return;
        }

        // Load entries
        const loadedEntries = await getAllEntries();
        console.log(`Loaded ${loadedEntries.length} entries from IndexedDB`);
        setEntries(loadedEntries.sort((a, b) => b.dateISO.localeCompare(a.dateISO)));

        // Load settings
        const loadedSettings = await getSettingsFromDB();
        if (loadedSettings) {
          console.log('Loaded settings from IndexedDB');
          setSettings(loadedSettings);
        } else {
          // Save default settings if none exist
          await saveSettingsToDB(defaultSettings);
          console.log('Saved default settings to IndexedDB');
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setDbHealthy(false);
        setIsLoading(false);
      }
    };

    initDB();
  }, []);

  /**
   * Save a new entry or merge with existing entry for today
   */
  const saveEntry = async (entryData: Partial<Entry>) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const existingEntry = entries.find(e => e.dateISO === today);

      let newEntry: Entry;

      if (existingEntry) {
        // Merge with existing entry
        newEntry = {
          ...existingEntry,
          ...entryData,
          good: entryData.good || existingEntry.good,
          improve: entryData.improve || existingEntry.improve,
          severeSlip: entryData.severeSlip || existingEntry.severeSlip,
          missedOpportunity: entryData.missedOpportunity || existingEntry.missedOpportunity,
          dua: entryData.dua || existingEntry.dua,
        };
      } else {
        // Create new entry
        newEntry = {
          id: `entry-${Date.now()}`,
          dateISO: today,
          good: entryData.good || null,
          improve: entryData.improve || null,
          severeSlip: entryData.severeSlip || null,
          missedOpportunity: entryData.missedOpportunity || null,
          dua: entryData.dua,
          privacy_level: entryData.privacy_level || 'normal',
        };
      }

      // Save to IndexedDB
      await saveEntryToDB(newEntry);

      // Update local state
      setEntries(prev => {
        const filtered = prev.filter(e => e.id !== newEntry.id);
        return [newEntry, ...filtered].sort((a, b) => b.dateISO.localeCompare(a.dateISO));
      });

      console.log('Entry saved successfully');
    } catch (error) {
      console.error('Failed to save entry:', error);
      throw error;
    }
  };

  /**
   * Update an existing entry
   */
  const updateEntry = async (updatedEntry: Entry) => {
    try {
      // Update in IndexedDB
      await updateEntryInDB(updatedEntry);

      // Update local state
      setEntries(prev =>
        prev.map(e => (e.id === updatedEntry.id ? updatedEntry : e))
          .sort((a, b) => b.dateISO.localeCompare(a.dateISO))
      );

      console.log('Entry updated successfully');
    } catch (error) {
      console.error('Failed to update entry:', error);
      throw error;
    }
  };

  /**
   * Update settings
   */
  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      // Save to IndexedDB
      await saveSettingsToDB(updatedSettings);
      
      // Update local state
      setSettings(updatedSettings);

      console.log('Settings updated successfully');
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  };

  /**
   * Clear all data (panic delete)
   */
  const clearAllData = async () => {
    try {
      // Clear IndexedDB
      await clearAllDataFromDB();

      // Reset local state
      setEntries([]);
      setSettings(defaultSettings);

      // Save default settings
      await saveSettingsToDB(defaultSettings);

      console.log('All data cleared successfully');
    } catch (error) {
      console.error('Failed to clear data:', error);
      throw error;
    }
  };

  /**
   * Get today's entry
   */
  const getTodayEntry = (): Entry | null => {
    const today = new Date().toISOString().split('T')[0];
    return entries.find(e => e.dateISO === today) || null;
  };

  return {
    entries,
    settings,
    isLoading,
    dbHealthy,
    saveEntry,
    updateEntry,
    updateSettings,
    clearAllData,
    getTodayEntry,
  };
}
