import React, { useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { DailyCheckin } from '@/components/daily-checkin';
import { CatalogEntry } from '@/components/catalog-entry';
import { HistoryView } from '@/components/history-view';
import { SettingsView } from '@/components/settings-view';
import { useStorage } from '@/hooks/use-storage';
import { useToast } from '@/hooks/use-toast';
import { type Entry } from '@/types';

type ViewType = 'today' | 'history' | 'settings';

export function MuhasabahApp() {
  const [currentView, setCurrentView] = useState<ViewType>('today');
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const { toast } = useToast();
  
  const {
    entries,
    settings,
    isLoading,
    saveEntry,
    updateEntry,
    updateSettings,
    clearAllData,
    getTodayEntry,
  } = useStorage();

  const handleSaveEntry = (entryData: Partial<Entry>) => {
    if (editingEntry) {
      // Updating existing entry
      updateEntry({ ...editingEntry, ...entryData });
      setEditingEntry(null);
      toast({
        title: "Entry updated",
        description: "May Allah accept your reflection.",
      });
    } else {
      // Saving new entry
      saveEntry(entryData);
      toast({
        title: "Entry saved",
        description: "May Allah accept your reflection.",
      });
    }
    
    if (currentView !== 'today') {
      setCurrentView('today');
    }
  };

  const handleEditEntry = (entry: Entry) => {
    setEditingEntry(entry);
    setCurrentView('today');
  };

  const handlePanicDelete = () => {
    clearAllData();
    setCurrentView('today');
    setEditingEntry(null);
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-peace flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-gradient-spiritual flex items-center justify-center mx-auto animate-pulse">
            <span className="text-2xl font-bold text-primary-foreground">م</span>
          </div>
          <p className="text-muted-foreground">Loading your spiritual journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-peace">
      <AppHeader 
        currentView={currentView} 
        onViewChange={setCurrentView}
      />
      
      <main className="pb-6">
        {currentView === 'today' && (
          <>
            {editingEntry && (
              <div className="bg-secondary/10 border-b border-secondary/20 p-4 text-center">
                <p className="text-sm text-secondary-foreground">
                  Editing entry from {new Date(editingEntry.dateISO).toLocaleDateString()}
                  <button 
                    onClick={handleCancelEdit}
                    className="ml-2 text-xs underline hover:no-underline"
                  >
                    Cancel
                  </button>
                </p>
              </div>
            )}
            <CatalogEntry 
              onSave={handleSaveEntry}
              existingEntry={editingEntry || getTodayEntry()}
            />
          </>
        )}
        
        {currentView === 'history' && (
          <HistoryView 
            entries={entries}
            onEditEntry={handleEditEntry}
          />
        )}
        
        {currentView === 'settings' && (
          <SettingsView 
            settings={settings}
            onUpdateSettings={updateSettings}
            onPanicDelete={handlePanicDelete}
          />
        )}
      </main>
    </div>
  );
}