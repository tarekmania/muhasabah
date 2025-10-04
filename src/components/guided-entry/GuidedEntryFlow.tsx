import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { 
  Sun, 
  BookOpen, 
  Sparkles, 
  Users, 
  Heart, 
  Briefcase, 
  Moon,
  Scale,
  CheckCircle2
} from 'lucide-react';
import { JourneyStep } from './JourneyStep';
import { StepProgress } from './StepProgress';
import { CategoryItemGrid } from './CategoryItemGrid';
import { InspirationCard } from './InspirationCard';
import { MoodSelector } from './MoodSelector';
import { TomorrowIntention } from './TomorrowIntention';
import { DailyLedger } from '@/components/daily-ledger';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { GuidedEntryState, getCurrentTimeContext } from '@/types/guided-entry';
import { Entry, CatalogItem } from '@/types';
import { useCatalog } from '@/hooks/use-catalog';
import { toast } from '@/hooks/use-toast';

interface GuidedEntryFlowProps {
  onSave: (entry: Partial<Entry>) => void;
  onExit: () => void;
  existingEntry?: Entry | null;
  targetDate: string;
  catalogItems: CatalogItem[];
}

const STORAGE_KEY_PREFIX = 'guided_entry_draft_';

export function GuidedEntryFlow({ 
  onSave, 
  onExit, 
  existingEntry, 
  targetDate,
  catalogItems 
}: GuidedEntryFlowProps) {
  const { catalog, updateItemUsage } = useCatalog();
  const timeContext = getCurrentTimeContext();

  // Initialize state from draft or existing entry
  const [state, setState] = useState<GuidedEntryState>(() => {
    const draftKey = `${STORAGE_KEY_PREFIX}${targetDate}`;
    const savedDraft = localStorage.getItem(draftKey);
    
    if (savedDraft) {
      try {
        return JSON.parse(savedDraft);
      } catch {
        // Fall through to default
      }
    }

    // Convert existing entry to guided state
    if (existingEntry) {
      const selectedItems: Record<string, number> = {};
      
      existingEntry.good?.itemIds?.forEach((id, idx) => {
        selectedItems[id] = existingEntry.good?.qty?.[id] || 1;
      });
      existingEntry.improve?.itemIds?.forEach((id) => {
        selectedItems[id] = existingEntry.improve?.qty?.[id] || 1;
      });
      existingEntry.severeSlip?.itemIds?.forEach((id) => {
        selectedItems[id] = existingEntry.severeSlip?.qty?.[id] || 1;
      });
      existingEntry.missedOpportunity?.itemIds?.forEach((id) => {
        selectedItems[id] = existingEntry.missedOpportunity?.qty?.[id] || 1;
      });

      return {
        currentStep: 1,
        dateISO: targetDate,
        selectedItems,
        notes: {
          personal: existingEntry.good?.note || existingEntry.improve?.note,
          gratitude: '',
          tomorrowIntention: existingEntry.missedOpportunity?.intention || '',
        },
        tawbah: existingEntry.severeSlip?.tawbah || false,
        completedSteps: [],
        lastSaved: new Date().toISOString(),
      };
    }

    return {
      currentStep: 1,
      dateISO: targetDate,
      selectedItems: {},
      notes: {},
      tawbah: false,
      completedSteps: [],
      lastSaved: new Date().toISOString(),
    };
  });

  // Auto-save draft
  useEffect(() => {
    const draftKey = `${STORAGE_KEY_PREFIX}${targetDate}`;
    localStorage.setItem(draftKey, JSON.stringify(state));
  }, [state, targetDate]);

  const goToStep = (step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  const handleNext = () => {
    // Mark current step as completed
    if (!state.completedSteps.includes(state.currentStep)) {
      setState(prev => ({
        ...prev,
        completedSteps: [...prev.completedSteps, prev.currentStep],
      }));
    }
    
    if (state.currentStep < 9) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }
  };

  const handleBack = () => {
    if (state.currentStep > 1) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your progress has been saved. You can continue later.",
      duration: 2000,
    });
    onExit();
  };

  const handleComplete = () => {
    // Convert guided state to Entry format
    const entryData: Partial<Entry> = {
      dateISO: targetDate,
    };

    // Separate items by type
    const goodItems: string[] = [];
    const improveItems: string[] = [];
    const severeItems: string[] = [];
    const missedItems: string[] = [];
    const goodQty: Record<string, number> = {};
    const improveQty: Record<string, number> = {};
    const severeQty: Record<string, number> = {};
    const missedQty: Record<string, number> = {};

    Object.entries(state.selectedItems).forEach(([itemId, quantity]) => {
      const item = catalogItems.find(i => i.id === itemId);
      if (!item) return;

      if (item.type === 'GOOD') {
        goodItems.push(itemId);
        goodQty[itemId] = quantity;
      } else if (item.type === 'IMPROVE') {
        improveItems.push(itemId);
        improveQty[itemId] = quantity;
      } else if (item.type === 'SEVERE') {
        severeItems.push(itemId);
        severeQty[itemId] = quantity;
      } else if (item.type === 'MISSED_OPPORTUNITY') {
        missedItems.push(itemId);
        missedQty[itemId] = quantity;
      }
    });

    if (goodItems.length > 0) {
      entryData.good = {
        itemIds: goodItems,
        qty: goodQty,
        note: state.notes.personal,
      };
    }

    if (improveItems.length > 0) {
      entryData.improve = {
        itemIds: improveItems,
        qty: improveQty,
        note: state.notes.personal,
      };
    }

    if (severeItems.length > 0) {
      entryData.severeSlip = {
        itemIds: severeItems,
        qty: severeQty,
        note: state.notes.personal,
        tawbah: state.tawbah,
      };
    }

    if (missedItems.length > 0) {
      entryData.missedOpportunity = {
        itemIds: missedItems,
        qty: missedQty,
        note: state.notes.personal,
        intention: state.notes.tomorrowIntention,
      };
    }

    // Update usage stats
    updateItemUsage(Object.keys(state.selectedItems));

    // Save entry
    onSave(entryData);

    // Clear draft
    const draftKey = `${STORAGE_KEY_PREFIX}${targetDate}`;
    localStorage.removeItem(draftKey);

    toast({
      title: "Alhamdulillah! 🎉",
      description: "Your daily reflection is complete.",
      duration: 3000,
    });

    onExit();
  };

  const handleItemToggle = (item: CatalogItem) => {
    setState(prev => {
      const newSelectedItems = { ...prev.selectedItems };
      
      if (newSelectedItems[item.id]) {
        delete newSelectedItems[item.id];
      } else {
        newSelectedItems[item.id] = 1;
      }
      
      return { ...prev, selectedItems: newSelectedItems };
    });
  };

  const selectedItemTitles = useMemo(() => {
    return Object.keys(state.selectedItems)
      .map(id => catalogItems.find(item => item.id === id)?.title)
      .filter(Boolean) as string[];
  }, [state.selectedItems, catalogItems]);

  const improveItemTitles = useMemo(() => {
    return Object.keys(state.selectedItems)
      .map(id => {
        const item = catalogItems.find(item => item.id === id);
        return item?.type === 'IMPROVE' ? item.title : null;
      })
      .filter(Boolean) as string[];
  }, [state.selectedItems, catalogItems]);

  // Render current step
  const renderStep = () => {
    const date = new Date(targetDate);
    const hijriDate = ""; // Could add hijri date conversion
    const greeting = timeContext === 'morning' ? 'Good morning' : 
                     timeContext === 'afternoon' ? 'Good afternoon' :
                     timeContext === 'evening' ? 'Good evening' : 'As-salamu alaykum';

    switch (state.currentStep) {
      case 1: // Welcome
        return (
          <JourneyStep
            stepNumber={1}
            title="Welcome"
            icon={<Sun className="h-5 w-5" />}
            onNext={handleNext}
            onSaveDraft={handleSaveDraft}
            isFirstStep
          >
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold">{greeting}!</h2>
                <p className="text-muted-foreground">
                  {format(date, 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-sm text-muted-foreground">
                  Let's reflect on your day and draw closer to Allah
                </p>
              </div>

              <MoodSelector
                value={state.mood}
                onChange={(mood) => setState(prev => ({ ...prev, mood }))}
              />

              <InspirationCard category="default" />
            </div>
          </JourneyStep>
        );

      case 2: // Prayer & Worship
        return (
          <JourneyStep
            stepNumber={2}
            title="Prayer & Worship"
            icon={<Sun className="h-5 w-5" />}
            onNext={handleNext}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft}
          >
            <div className="space-y-4">
              <InspirationCard category="prayer" />
              
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">
                  Track your prayers and worship today
                </h3>
                <CategoryItemGrid
                  categoryIds={['prayer']}
                  selectedItems={state.selectedItems}
                  onItemToggle={handleItemToggle}
                />
              </div>
            </div>
          </JourneyStep>
        );

      case 3: // Quran & Dhikr
        return (
          <JourneyStep
            stepNumber={3}
            title="Quran & Dhikr"
            icon={<BookOpen className="h-5 w-5" />}
            onNext={handleNext}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft}
          >
            <div className="space-y-4">
              <InspirationCard category="quran" />
              
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">
                  Did you remember Allah today?
                </h3>
                <CategoryItemGrid
                  categoryIds={['quran']}
                  selectedItems={state.selectedItems}
                  onItemToggle={handleItemToggle}
                />
              </div>
            </div>
          </JourneyStep>
        );

      case 4: // Character & Actions
        return (
          <JourneyStep
            stepNumber={4}
            title="Character & Actions"
            icon={<Sparkles className="h-5 w-5" />}
            onNext={handleNext}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft}
          >
            <div className="space-y-4">
              <InspirationCard category="character" />
              
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">
                  Reflect on your behavior and character
                </h3>
                <CategoryItemGrid
                  categoryIds={['character', 'emotions']}
                  selectedItems={state.selectedItems}
                  onItemToggle={handleItemToggle}
                />
              </div>
            </div>
          </JourneyStep>
        );

      case 5: // Family & Community
        return (
          <JourneyStep
            stepNumber={5}
            title="Family & Community"
            icon={<Users className="h-5 w-5" />}
            onNext={handleNext}
            onBack={handleBack}
            onSkip={handleSkip}
            onSaveDraft={handleSaveDraft}
            canSkip
          >
            <div className="space-y-4">
              <InspirationCard category="family" />
              
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">
                  How did you connect with others?
                </h3>
                <CategoryItemGrid
                  categoryIds={['family', 'community', 'marriage', 'parenting']}
                  selectedItems={state.selectedItems}
                  onItemToggle={handleItemToggle}
                />
              </div>
            </div>
          </JourneyStep>
        );

      case 6: // Charity & Learning
        return (
          <JourneyStep
            stepNumber={6}
            title="Charity & Learning"
            icon={<Heart className="h-5 w-5" />}
            onNext={handleNext}
            onBack={handleBack}
            onSkip={handleSkip}
            onSaveDraft={handleSaveDraft}
            canSkip
          >
            <div className="space-y-4">
              <InspirationCard category="charity" />
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm text-muted-foreground">Charity & Giving</h3>
                  <CategoryItemGrid
                    categoryIds={['charity']}
                    selectedItems={state.selectedItems}
                    onItemToggle={handleItemToggle}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="font-medium text-sm text-muted-foreground">Learning & Growth</h3>
                  <CategoryItemGrid
                    categoryIds={['study', 'student-life']}
                    selectedItems={state.selectedItems}
                    onItemToggle={handleItemToggle}
                  />
                </div>
              </div>
            </div>
          </JourneyStep>
        );

      case 7: // Daily Life & Habits
        return (
          <JourneyStep
            stepNumber={7}
            title="Daily Life & Habits"
            icon={<Briefcase className="h-5 w-5" />}
            onNext={handleNext}
            onBack={handleBack}
            onSkip={handleSkip}
            onSaveDraft={handleSaveDraft}
            canSkip
          >
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm text-muted-foreground">Work & Productivity</h3>
                  <CategoryItemGrid
                    categoryIds={['work', 'workplace']}
                    selectedItems={state.selectedItems}
                    onItemToggle={handleItemToggle}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="font-medium text-sm text-muted-foreground">Health & Wellness</h3>
                  <CategoryItemGrid
                    categoryIds={['health']}
                    selectedItems={state.selectedItems}
                    onItemToggle={handleItemToggle}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="font-medium text-sm text-muted-foreground">Digital Life & Time</h3>
                  <CategoryItemGrid
                    categoryIds={['digital', 'time']}
                    selectedItems={state.selectedItems}
                    onItemToggle={handleItemToggle}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="font-medium text-sm text-muted-foreground">Finance & Environment</h3>
                  <CategoryItemGrid
                    categoryIds={['finance', 'environment']}
                    selectedItems={state.selectedItems}
                    onItemToggle={handleItemToggle}
                  />
                </div>
              </div>
            </div>
          </JourneyStep>
        );

      case 8: // Special Contexts
        return (
          <JourneyStep
            stepNumber={8}
            title="Special Contexts"
            icon={<Moon className="h-5 w-5" />}
            onNext={handleNext}
            onBack={handleBack}
            onSkip={handleSkip}
            onSaveDraft={handleSaveDraft}
            canSkip
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Did any of these special contexts apply today?
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm text-muted-foreground">Seasonal & Special</h3>
                  <CategoryItemGrid
                    categoryIds={['seasonal', 'ramadan', 'hajj-umrah']}
                    selectedItems={state.selectedItems}
                    onItemToggle={handleItemToggle}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="font-medium text-sm text-muted-foreground">Travel & Events</h3>
                  <CategoryItemGrid
                    categoryIds={['travel-journey', 'social-events']}
                    selectedItems={state.selectedItems}
                    onItemToggle={handleItemToggle}
                  />
                </div>
              </div>
            </div>
          </JourneyStep>
        );

      case 9: // Reflection & Balance
        return (
          <JourneyStep
            stepNumber={9}
            title="Reflection & Balance"
            icon={<Scale className="h-5 w-5" />}
            onNext={handleComplete}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft}
            isLastStep
            nextLabel="Complete Entry"
          >
            <div className="space-y-6">
              {/* Balance Preview */}
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Your Spiritual Balance</h3>
                <div className="p-4 rounded-lg bg-accent/30 border">
                  <p className="text-sm text-center text-muted-foreground">
                    {selectedItemTitles.length > 0 
                      ? `${selectedItemTitles.length} items tracked today`
                      : 'No items tracked yet'}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Personal Reflection */}
              <div className="space-y-3">
                <Label>What did you learn today?</Label>
                <Textarea
                  placeholder="Write your thoughts, lessons learned, or any reflections..."
                  value={state.notes.personal || ''}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    notes: { ...prev.notes, personal: e.target.value }
                  }))}
                  className="min-h-[100px] resize-none"
                />
              </div>

              {/* Gratitude */}
              <div className="space-y-3">
                <Label>What are you grateful for?</Label>
                <Textarea
                  placeholder="Count your blessings..."
                  value={state.notes.gratitude || ''}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    notes: { ...prev.notes, gratitude: e.target.value }
                  }))}
                  className="min-h-[80px] resize-none"
                />
              </div>

              {/* Tomorrow's Intention */}
              <TomorrowIntention
                value={state.notes.tomorrowIntention || ''}
                onChange={(value) => setState(prev => ({
                  ...prev,
                  notes: { ...prev.notes, tomorrowIntention: value }
                }))}
                suggestions={improveItemTitles}
              />

              {/* Tawbah Toggle */}
              {Object.keys(state.selectedItems).some(id => 
                catalogItems.find(item => item.id === id)?.type === 'SEVERE'
              ) && (
                <div className="flex items-center space-x-2 p-4 rounded-lg bg-accent/50 border">
                  <Switch
                    id="tawbah"
                    checked={state.tawbah}
                    onCheckedChange={(checked) => setState(prev => ({ ...prev, tawbah: checked }))}
                  />
                  <Label htmlFor="tawbah" className="text-sm">
                    I seek Allah's forgiveness for serious matters (Tawbah)
                  </Label>
                </div>
              )}

              {/* Completion Message */}
              <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">
                  Ready to complete your reflection?
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedItemTitles.length} items tracked
                </p>
              </div>
            </div>
          </JourneyStep>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <StepProgress
        totalSteps={9}
        currentStep={state.currentStep}
        completedSteps={state.completedSteps}
        onStepClick={goToStep}
      />
      
      {renderStep()}
    </div>
  );
}
