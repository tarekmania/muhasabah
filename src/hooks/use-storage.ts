import { useState, useEffect } from 'react';
import { type Entry, type Settings } from '@/types';

// Simple localStorage wrapper for MVP - will be replaced with encrypted storage
const STORAGE_KEYS = {
  ENTRIES: 'muhasabah_entries',
  SETTINGS: 'muhasabah_settings',
} as const;

const defaultSettings: Settings = {
  reminderHour: 21, // 9 PM
  reminderMinute: 0,
  biometricLock: false,
  privateMode: true, // Default to privacy-first
};

export function useStorage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    try {
      const savedEntries = localStorage.getItem(STORAGE_KEYS.ENTRIES);
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);

      if (savedEntries) {
        setEntries(JSON.parse(savedEntries));
      }
      
      if (savedSettings) {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      }
    } catch (error) {
      console.error('Failed to load data from storage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveEntry = (entryData: Partial<Entry>) => {
    const today = new Date().toISOString().split('T')[0];
    const existingIndex = entries.findIndex(e => e.dateISO === today);
    
    let updatedEntries: Entry[];
    
    if (existingIndex >= 0) {
      // Update existing entry by merging data
      updatedEntries = [...entries];
      const existing = updatedEntries[existingIndex];
      
      updatedEntries[existingIndex] = {
        ...existing,
        id: existing.id,
        dateISO: today,
        // Merge good data
        good: entryData.good || existing.good,
        // Merge improve data  
        improve: entryData.improve || existing.improve,
        // Merge severe slip data
        severeSlip: entryData.severeSlip || existing.severeSlip,
        // Merge missed opportunity data
        missedOpportunity: entryData.missedOpportunity || existing.missedOpportunity,
        // Update dua
        dua: entryData.dua !== undefined ? entryData.dua : existing.dua,
        // Update privacy level
        privacy_level: entryData.privacy_level || existing.privacy_level,
      };
    } else {
      // Create new entry
      const newEntry: Entry = {
        id: `entry_${Date.now()}`,
        dateISO: today,
        good: entryData.good || null,
        improve: entryData.improve || null,
        severeSlip: entryData.severeSlip || null,
        missedOpportunity: entryData.missedOpportunity || null,
        dua: entryData.dua,
        privacy_level: entryData.privacy_level || 'normal',
      };
      updatedEntries = [newEntry, ...entries];
    }

    setEntries(updatedEntries);
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(updatedEntries));
  };

  const updateEntry = (updatedEntry: Entry) => {
    const updatedEntries = entries.map(entry =>
      entry.id === updatedEntry.id ? updatedEntry : entry
    );
    setEntries(updatedEntries);
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(updatedEntries));
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));
  };

  const clearAllData = () => {
    setEntries([]);
    setSettings(defaultSettings);
    localStorage.removeItem(STORAGE_KEYS.ENTRIES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  };

  const getTodayEntry = (): Entry | null => {
    const today = new Date().toISOString().split('T')[0];
    return entries.find(entry => entry.dateISO === today) || null;
  };

  return {
    entries,
    settings,
    isLoading,
    saveEntry,
    updateEntry,
    updateSettings,
    clearAllData,
    getTodayEntry,
  };
}