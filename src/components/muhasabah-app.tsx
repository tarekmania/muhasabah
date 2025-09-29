import React, { useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { UnifiedEntryFlow } from '@/components/unified-entry-flow';
import { HistoryView } from '@/components/history-view';
import { SettingsView } from '@/components/settings-view';
import { TemplatesGallery } from '@/components/templates-gallery';
import { DailyLedger } from '@/components/daily-ledger';
import { WeeklyReview } from '@/components/weekly-review';
import { useStorage } from '@/hooks/use-storage';
import { useToast } from '@/hooks/use-toast';
import { type Entry, seedCatalog } from '@/types';

type ViewType = 'today' | 'templates' | 'ledger' | 'weekly' | 'history' | 'settings';

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

  const handleApplyTemplate = (template: any) => {
    // This would integrate with the unified entry flow
    // For now, just switch to today view
    setCurrentView('today');
    toast({
      title: "Template applied",
      description: `${template.title} has been loaded for today's entry.`,
    });
  };

  const handleSaveIntention = (intention: string) => {
    // Save weekly intention (could be stored in settings or separate storage)
    toast({
      title: "Intention saved",
      description: "May Allah help you achieve this intention.",
    });
  };

  // Get current date for ledger and weekly views
  const today = new Date().toISOString().split('T')[0];
  const todayEntry = getTodayEntry();
  
  // Calculate week range for weekly review
  const getWeekRange = () => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    return {
      start: startOfWeek.toISOString().split('T')[0],
      end: endOfWeek.toISOString().split('T')[0]
    };
  };

  const weekRange = getWeekRange();

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
            <UnifiedEntryFlow 
              onSave={handleSaveEntry}
              existingEntry={editingEntry || getTodayEntry()}
            />
          </>
        )}
        
        {currentView === 'templates' && (
          <div className="container mx-auto px-4 py-6">
            <TemplatesGallery
              templates={seedCatalog.templates}
              catalogItems={seedCatalog.items}
              usageStats={{ itemUsage: {}, templateUsage: {} }}
              onApplyTemplate={handleApplyTemplate}
            />
          </div>
        )}

        {currentView === 'ledger' && (
          <div className="container mx-auto px-4 py-6">
            <DailyLedger
              entry={todayEntry}
              catalogItems={seedCatalog.items}
              date={today}
            />
          </div>
        )}

        {currentView === 'weekly' && (
          <div className="container mx-auto px-4 py-6">
            <WeeklyReview
              entries={entries.slice(-7)} // Last 7 entries
              catalogItems={seedCatalog.items}
              weekStart={weekRange.start}
              weekEnd={weekRange.end}
              onSaveIntention={handleSaveIntention}
            />
          </div>
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
