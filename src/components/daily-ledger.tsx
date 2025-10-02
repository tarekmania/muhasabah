import React, { useState } from 'react';
import { Entry, CatalogItem } from '@/types';
import { SpiritualCard, SpiritualCardContent, SpiritualCardHeader, SpiritualCardTitle } from '@/components/ui/spiritual-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Scale, TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { QuantityEditDialog } from '@/components/quantity-edit-dialog';

interface DailyLedgerProps {
  entry: Entry | null;
  catalogItems: CatalogItem[];
  date: string;
  entries: Entry[];
  onDateChange?: (date: string) => void;
  onQuantityChange?: (itemId: string, type: 'good' | 'improve' | 'severe' | 'missed', newQuantity: number) => void;
}

export function DailyLedger({ entry, catalogItems, date, entries, onDateChange, onQuantityChange }: DailyLedgerProps) {
  const [editingQuantity, setEditingQuantity] = useState<{ itemId: string; type: string } | null>(null);
  // Parse date string properly to avoid timezone issues
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const [year, month, day] = date.split('-').map(Number);
    return new Date(year, month - 1, day);
  });

  const getItemById = (id: string) => {
    return catalogItems.find(item => item.id === id);
  };

  // Calculate credits (positive actions - right side)
  const credits: Array<{ title: string; emoji: string; count: number; weight: number }> = [];
  let totalCredits = 0;

  if (entry?.good?.itemIds) {
    entry.good.itemIds.forEach(itemId => {
      const item = getItemById(itemId);
      if (item) {
        const count = entry.good?.qty?.[itemId] || 1;
        const weight = count * 10; // Each good deed has a weight
        credits.push({ title: item.title, emoji: item.emoji, count, weight });
        totalCredits += weight;
      }
    });
  }

  // Calculate debits (areas of concern - left side)
  const debits: Array<{ title: string; emoji: string; count: number; severity: 'light' | 'moderate' | 'severe'; weight: number }> = [];
  let totalDebits = 0;

  // Improve items (light concern)
  if (entry?.improve?.itemIds) {
    entry.improve.itemIds.forEach(itemId => {
      const item = getItemById(itemId);
      if (item) {
        const count = entry.improve?.qty?.[itemId] || 1;
        const weight = count * 5; // Areas to improve have moderate weight
        debits.push({ title: item.title, emoji: item.emoji, count, severity: 'light', weight });
        totalDebits += weight;
      }
    });
  }

  // Severe items (severe concern)
  if (entry?.severeSlip?.itemIds) {
    entry.severeSlip.itemIds.forEach(itemId => {
      const item = getItemById(itemId);
      if (item) {
        const count = entry.severeSlip?.qty?.[itemId] || 1;
        const weight = count * 20; // Severe items have high weight
        debits.push({ title: item.title, emoji: item.emoji, count, severity: 'severe', weight });
        totalDebits += weight;
      }
    });
  }

  // Missed opportunities (moderate concern)
  if (entry?.missedOpportunity?.itemIds) {
    entry.missedOpportunity.itemIds.forEach(itemId => {
      const item = getItemById(itemId);
      if (item) {
        const count = entry.missedOpportunity?.qty?.[itemId] || 1;
        const weight = count * 8;
        debits.push({ title: item.title, emoji: item.emoji, count, severity: 'moderate', weight });
        totalDebits += weight;
      }
    });
  }

  // Calculate balance
  const balance = totalCredits - totalDebits;
  const balancePercentage = totalCredits > 0 ? (balance / totalCredits) * 100 : 0;

  // Get spiritual guidance based on balance
  const getGuidance = () => {
    if (balance > 50) {
      return {
        message: "Alhamdulillah! Your positive actions outweigh areas of concern.",
        advice: "Continue your excellent spiritual journey and seek consistency.",
        icon: TrendingUp,
        color: "text-primary"
      };
    } else if (balance > 0) {
      return {
        message: "May Allah accept your efforts.",
        advice: "Keep striving and focus on maintaining good habits while addressing areas of improvement.",
        icon: TrendingUp,
        color: "text-secondary"
      };
    } else if (balance === 0) {
      return {
        message: "Seek balance in your spiritual journey.",
        advice: "Focus on increasing your good deeds and addressing areas that need attention.",
        icon: Minus,
        color: "text-muted-foreground"
      };
    } else {
      return {
        message: "May Allah guide you to a better path.",
        advice: "This is a time for deep reflection and sincere Tawbah. Focus on rebuilding your spiritual foundation.",
        icon: TrendingDown,
        color: "text-destructive"
      };
    }
  };

  const guidance = getGuidance();
  const GuidanceIcon = guidance.icon;

  // Date navigation
  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate && onDateChange) {
      setSelectedDate(newDate);
      onDateChange(format(newDate, 'yyyy-MM-dd'));
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
    if (onDateChange) {
      onDateChange(format(newDate, 'yyyy-MM-dd'));
    }
  };

  // Get dates with entries for calendar highlighting
  const datesWithEntries = entries.map(e => {
    const [year, month, day] = e.dateISO.split('-').map(Number);
    return new Date(year, month - 1, day);
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header with Date Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Spiritual Balance Sheet</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDate('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
                modifiers={{
                  hasEntry: datesWithEntries
                }}
                modifiersStyles={{
                  hasEntry: { fontWeight: 'bold', textDecoration: 'underline' }
                }}
              />
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDate('next')}
            disabled={format(selectedDate, 'yyyy-MM-dd') >= format(new Date(), 'yyyy-MM-dd')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!entry ? (
        <SpiritualCard variant="peaceful">
          <SpiritualCardContent className="p-12 text-center">
            <Scale className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Entry for This Date</h3>
            <p className="text-muted-foreground">
              Start your spiritual reflection by logging your deeds and reflections.
            </p>
          </SpiritualCardContent>
        </SpiritualCard>
      ) : (
        <>
          {/* Balance Overview */}
          <SpiritualCard variant="elevated" className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <SpiritualCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${balance > 0 ? 'bg-primary' : balance < 0 ? 'bg-destructive' : 'bg-muted'}`}>
                    <GuidanceIcon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">
                      Balance: {balance > 0 ? '+' : ''}{balance}
                    </h3>
                    <p className="text-sm text-muted-foreground">{guidance.message}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    {credits.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Credits</div>
                  <div className="text-3xl font-bold text-destructive mt-2">
                    {debits.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Debits</div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-background/60 rounded-lg">
                <p className="text-sm italic text-muted-foreground">{guidance.advice}</p>
              </div>
            </SpiritualCardContent>
          </SpiritualCard>

          {/* Accounting Sheet */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side - Debits (Areas of Concern) */}
            <SpiritualCard variant="default" className="border-l-4 border-l-destructive/50">
              <SpiritualCardHeader className="bg-destructive/5">
                <SpiritualCardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                  Debits - Areas of Concern
                </SpiritualCardTitle>
              </SpiritualCardHeader>
              <SpiritualCardContent className="p-6">
                {debits.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No areas of concern recorded</p>
                    <p className="text-xs mt-2">Alhamdulillah!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                     {debits.map((debit, idx) => {
                      const itemIdMatch = entry?.improve?.itemIds?.find(id => getItemById(id)?.title === debit.title) ||
                                          entry?.severeSlip?.itemIds?.find(id => getItemById(id)?.title === debit.title) ||
                                          entry?.missedOpportunity?.itemIds?.find(id => getItemById(id)?.title === debit.title);
                      
                      return (
                        <div
                          key={idx}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors",
                            debit.severity === 'severe' && "bg-destructive/10 border-destructive/30",
                            debit.severity === 'moderate' && "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900",
                            debit.severity === 'light' && "bg-muted/50 border-border"
                          )}
                          onClick={() => itemIdMatch && setEditingQuantity({ itemId: itemIdMatch, type: debit.severity })}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-2xl">{debit.emoji}</span>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{debit.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs",
                                    debit.severity === 'severe' && "border-destructive text-destructive",
                                    debit.severity === 'moderate' && "border-orange-500 text-orange-600 dark:text-orange-400",
                                    debit.severity === 'light' && "border-muted-foreground text-muted-foreground"
                                  )}
                                >
                                  {debit.count}×
                                </Badge>
                                <span className="text-xs text-muted-foreground">Tap to edit</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-destructive">-{debit.weight}</p>
                          </div>
                        </div>
                      );
                    })}
                    <div className="pt-4 border-t-2 border-destructive/20">
                      <div className="flex items-center justify-between font-bold">
                        <span>Total Debits</span>
                        <span className="text-xl text-destructive">-{totalDebits}</span>
                      </div>
                    </div>
                  </div>
                )}
              </SpiritualCardContent>
            </SpiritualCard>

            {/* Right Side - Credits (Positive Actions) */}
            <SpiritualCard variant="default" className="border-r-4 border-r-primary/50">
              <SpiritualCardHeader className="bg-primary/5">
                <SpiritualCardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Credits - Positive Actions
                </SpiritualCardTitle>
              </SpiritualCardHeader>
              <SpiritualCardContent className="p-6">
                {credits.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No positive actions recorded</p>
                    <p className="text-xs mt-2">Begin your journey today</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                   {credits.map((credit, idx) => {
                      const itemId = entry?.good?.itemIds?.find(id => getItemById(id)?.title === credit.title);
                      
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors"
                          onClick={() => itemId && setEditingQuantity({ itemId, type: 'good' })}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-2xl">{credit.emoji}</span>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{credit.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs border-primary text-primary">
                                  {credit.count}×
                                </Badge>
                                <span className="text-xs text-muted-foreground">Tap to edit</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">+{credit.weight}</p>
                          </div>
                        </div>
                      );
                    })}
                    <div className="pt-4 border-t-2 border-primary/20">
                      <div className="flex items-center justify-between font-bold">
                        <span>Total Credits</span>
                        <span className="text-xl text-primary">+{totalCredits}</span>
                      </div>
                    </div>
                  </div>
                )}
              </SpiritualCardContent>
            </SpiritualCard>
          </div>

          {/* Reflection Notes */}
          {(entry.good?.note || entry.improve?.note || entry.severeSlip?.note || entry.missedOpportunity?.note || entry.missedOpportunity?.intention) && (
            <SpiritualCard variant="peaceful">
              <SpiritualCardHeader>
                <SpiritualCardTitle>Personal Reflections</SpiritualCardTitle>
              </SpiritualCardHeader>
              <SpiritualCardContent className="p-6 space-y-4">
                {entry.good?.note && (
                  <div>
                    <p className="text-xs font-medium text-primary mb-1">Good Deeds Reflection</p>
                    <p className="text-sm bg-primary/5 p-3 rounded">{entry.good.note}</p>
                  </div>
                )}
                {entry.improve?.note && (
                  <div>
                    <p className="text-xs font-medium text-secondary-foreground mb-1">Improvement Note</p>
                    <p className="text-sm bg-secondary/10 p-3 rounded">{entry.improve.note}</p>
                  </div>
                )}
                {entry.severeSlip?.note && (
                  <div>
                    <p className="text-xs font-medium text-destructive mb-1">Tawbah Reflection (Private)</p>
                    <p className="text-sm bg-destructive/5 p-3 rounded border-l-2 border-destructive">{entry.severeSlip.note}</p>
                  </div>
                )}
                {entry.missedOpportunity?.note && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Missed Opportunity Note</p>
                    <p className="text-sm bg-muted/30 p-3 rounded">{entry.missedOpportunity.note}</p>
                  </div>
                )}
                {entry.missedOpportunity?.intention && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Future Intention</p>
                    <p className="text-sm bg-muted/30 p-3 rounded italic">{entry.missedOpportunity.intention}</p>
                  </div>
                )}
              </SpiritualCardContent>
            </SpiritualCard>
          )}

          {/* Islamic Reminder */}
          <div className="text-center text-sm text-muted-foreground bg-muted/20 p-4 rounded-lg border">
            <p className="italic">
              "This balance sheet is a tool for self-reflection, not a judgment. Only Allah (SWT) knows the true weight of deeds and the sincerity of hearts. 
              Use this as a guide to improve your relationship with your Creator."
            </p>
          </div>
        </>
      )}

      {/* Quantity Edit Dialog */}
      {editingQuantity && (() => {
        const item = getItemById(editingQuantity.itemId);
        if (!item) return null;

        const getCurrentQuantity = () => {
          if (editingQuantity.type === 'good') return entry?.good?.qty?.[editingQuantity.itemId] || 1;
          if (editingQuantity.type === 'light') return entry?.improve?.qty?.[editingQuantity.itemId] || 1;
          if (editingQuantity.type === 'severe') return entry?.severeSlip?.qty?.[editingQuantity.itemId] || 1;
          if (editingQuantity.type === 'moderate') return entry?.missedOpportunity?.qty?.[editingQuantity.itemId] || 1;
          return 1;
        };

        const handleSave = (newQuantity: number) => {
          if (onQuantityChange) {
            let type: 'good' | 'improve' | 'severe' | 'missed' = 'good';
            if (editingQuantity.type === 'light') type = 'improve';
            else if (editingQuantity.type === 'severe') type = 'severe';
            else if (editingQuantity.type === 'moderate') type = 'missed';
            
            onQuantityChange(editingQuantity.itemId, type, newQuantity);
          }
          setEditingQuantity(null);
        };

        return (
          <QuantityEditDialog
            isOpen={true}
            onClose={() => setEditingQuantity(null)}
            itemTitle={item.title}
            itemEmoji={item.emoji}
            currentQuantity={getCurrentQuantity()}
            onSave={handleSave}
          />
        );
      })()}
    </div>
  );
}
