import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { SpiritualCard, SpiritualCardContent, SpiritualCardHeader, SpiritualCardTitle } from '@/components/ui/spiritual-card';
import { Button } from '@/components/ui/button';
import { CalendarWidget } from '@/components/calendar-widget';
import { Clock, TrendingUp, Flame, Moon, Sun, Sunrise, Sunset, BookOpen, Edit3, CheckCircle2, Award, BarChart3 } from 'lucide-react';
import { Entry } from '@/types';
import { useCatalog } from '@/hooks/use-catalog';
import { calculateDaysSinceFirstEntry } from '@/lib/dashboard-helpers';

interface DashboardProps {
  entries: Entry[];
}

export default function Dashboard({ entries }: DashboardProps) {
  const navigate = useNavigate();
  const { catalog } = useCatalog();

  // Calculate streak
  const streak = useMemo(() => {
    let count = 0;
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
    );
    
    const today = new Date().toISOString().split('T')[0];
    let currentDate = new Date(today);
    
    for (const entry of sortedEntries) {
      const entryDate = entry.dateISO;
      const expectedDate = currentDate.toISOString().split('T')[0];
      
      if (entryDate === expectedDate) {
        count++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return count;
  }, [entries]);

  // Get today's entry
  const todayISO = new Date().toISOString().split('T')[0];
  const todayEntry = entries.find(e => e.dateISO === todayISO);

  // Get time-based greeting and suggestions
  const getTimeContext = () => {
    const hour = new Date().getHours();
    
    if (hour < 5) {
      return {
        icon: Moon,
        greeting: "Tahajjud Time",
        message: "The best time for Du'ā",
        suggestions: ["Night prayer", "Qur'an recitation", "Istighfar"],
        color: "text-primary"
      };
    } else if (hour < 12) {
      return {
        icon: Sunrise,
        greeting: "Sabāḥ al-Khayr",
        message: "Start your day with remembrance",
        suggestions: ["Morning adhkar", "Fajr prayer", "Qur'an recitation"],
        color: "text-secondary"
      };
    } else if (hour < 16) {
      return {
        icon: Sun,
        greeting: "Blessed Afternoon",
        message: "Continue your spiritual journey",
        suggestions: ["Dhikr after Dhuhr", "Good deeds", "Learning"],
        color: "text-secondary"
      };
    } else if (hour < 19) {
      return {
        icon: Sunset,
        greeting: "Maghrib Approaching",
        message: "Prepare for evening prayers",
        suggestions: ["'Asr prayer", "Du'ā before sunset", "Charity"],
        color: "text-primary"
      };
    } else {
      return {
        icon: Moon,
        greeting: "Blessed Evening",
        message: "Reflect on your day",
        suggestions: ["Evening adhkar", "Witr prayer", "Family time"],
        color: "text-primary"
      };
    }
  };

  const timeContext = getTimeContext();
  const TimeIcon = timeContext.icon;

  // Get today's statistics
  const todayStats = useMemo(() => {
    if (!todayEntry) return null;

    const goodCount = todayEntry.good?.itemIds?.length || 0;
    const improveCount = todayEntry.improve?.itemIds?.length || 0;
    const totalActions = goodCount + improveCount;

    return { goodCount, improveCount, totalActions };
  }, [todayEntry]);

  // Calculate weekly summary
  const weeklyStats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    
    const weekEntries = entries.filter(e => {
      const entryDate = new Date(e.dateISO);
      return entryDate >= weekAgo && entryDate <= now;
    });

    const totalGoodDeeds = weekEntries.reduce((acc, e) => 
      acc + (e.good?.itemIds?.length || 0), 0
    );

    return {
      entriesThisWeek: weekEntries.length,
      totalGoodDeeds
    };
  }, [entries]);

  // Calculate all-time statistics
  const allTimeStats = useMemo(() => {
    const totalGoodDeeds = entries.reduce((sum, e) => {
      const goodCount = e.good?.itemIds?.reduce((acc, id) => acc + (e.good?.qty?.[id] || 1), 0) || 0;
      return sum + goodCount;
    }, 0);

    const totalImproveAreas = entries.reduce((sum, e) => {
      const improveCount = (e.improve?.itemIds?.length || 0) + 
                          (e.severeSlip?.itemIds?.length || 0) + 
                          (e.missedOpportunity?.itemIds?.length || 0);
      return sum + improveCount;
    }, 0);

    const averageActionsPerDay = entries.length > 0 
      ? Math.round(entries.reduce((sum, e) => {
          const goodCount = e.good?.itemIds?.length || 0;
          return sum + goodCount;
        }, 0) / entries.length)
      : 0;

    const daysSinceFirst = calculateDaysSinceFirstEntry(entries);
    const consistencyRate = daysSinceFirst > 0 
      ? Math.round((entries.length / daysSinceFirst) * 100)
      : 0;

    return {
      totalGoodDeeds,
      totalImproveAreas,
      averageActionsPerDay,
      consistencyRate,
    };
  }, [entries]);

  // Calculate personal records
  const personalRecords = useMemo(() => {
    const bestDay = entries.reduce((best, e) => {
      const goodCount = e.good?.itemIds?.reduce((acc, id) => acc + (e.good?.qty?.[id] || 1), 0) || 0;
      return goodCount > best.count ? { date: e.dateISO, count: goodCount } : best;
    }, { date: '', count: 0 });

    // Calculate monthly comparison
    const now = new Date();
    const thisMonthStart = format(new Date(now.getFullYear(), now.getMonth(), 1), 'yyyy-MM-dd');
    const lastMonthStart = format(new Date(now.getFullYear(), now.getMonth() - 1, 1), 'yyyy-MM-dd');
    const lastMonthEnd = format(new Date(now.getFullYear(), now.getMonth(), 0), 'yyyy-MM-dd');
    
    const thisMonthEntries = entries.filter(e => e.dateISO >= thisMonthStart);
    const lastMonthEntries = entries.filter(e => e.dateISO >= lastMonthStart && e.dateISO <= lastMonthEnd);
    
    const thisMonthGoodDeeds = thisMonthEntries.reduce((sum, e) => {
      const goodCount = e.good?.itemIds?.reduce((acc, id) => acc + (e.good?.qty?.[id] || 1), 0) || 0;
      return sum + goodCount;
    }, 0);
    
    const lastMonthGoodDeeds = lastMonthEntries.reduce((sum, e) => {
      const goodCount = e.good?.itemIds?.reduce((acc, id) => acc + (e.good?.qty?.[id] || 1), 0) || 0;
      return sum + goodCount;
    }, 0);
    
    const monthlyChange = lastMonthGoodDeeds > 0 
      ? Math.round(((thisMonthGoodDeeds - lastMonthGoodDeeds) / lastMonthGoodDeeds) * 100)
      : 0;

    return {
      bestDay,
      monthlyChange,
      thisMonthGoodDeeds,
      lastMonthGoodDeeds
    };
  }, [entries]);

  const handleDateSelect = (date: Date) => {
    const dateISO = format(date, 'yyyy-MM-dd');
    navigate(`/entry/${dateISO}`);
  };

  const handleNewEntry = () => {
    navigate('/entry');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      {/* Time-based Contextual Card */}
      <SpiritualCard variant="elevated" className="bg-gradient-to-br from-primary/5 to-secondary/5">
        <SpiritualCardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full bg-gradient-spiritual ${timeContext.color}`}>
              <TimeIcon className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1 bg-gradient-spiritual bg-clip-text text-transparent">
                {timeContext.greeting}
              </h2>
              <p className="text-muted-foreground mb-3">{timeContext.message}</p>
              <div className="flex flex-wrap gap-2">
                {timeContext.suggestions.map((suggestion, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-background/60 text-xs font-medium border border-border"
                  >
                    {suggestion}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SpiritualCardContent>
      </SpiritualCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          onClick={handleNewEntry}
          size="lg"
          className="h-20 text-lg"
        >
          <Edit3 className="mr-2 h-5 w-5" />
          {todayEntry ? 'Update Today\'s Entry' : 'Create Today\'s Entry'}
        </Button>
        
        <SpiritualCard variant="default">
          <SpiritualCardContent className="p-4">
            <CalendarWidget
              selectedDate={new Date()}
              onDateSelect={handleDateSelect}
              entries={entries}
            />
          </SpiritualCardContent>
        </SpiritualCard>
      </div>

      {/* Stats Grid - Enhanced */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Streak Card */}
        <SpiritualCard variant="default">
          <SpiritualCardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-primary">
                <Flame className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold">{streak} days</p>
              </div>
            </div>
          </SpiritualCardContent>
        </SpiritualCard>

        {/* Today's Actions */}
        <SpiritualCard variant="default">
          <SpiritualCardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-secondary">
                <TrendingUp className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Today's Actions</p>
                <p className="text-2xl font-bold">{todayStats?.totalActions || 0}</p>
              </div>
            </div>
          </SpiritualCardContent>
        </SpiritualCard>

        {/* Total Entries */}
        <SpiritualCard variant="default">
          <SpiritualCardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Entries</p>
                <p className="text-2xl font-bold">{entries.length}</p>
              </div>
            </div>
          </SpiritualCardContent>
        </SpiritualCard>

        {/* All-Time Good Deeds */}
        <SpiritualCard variant="default">
          <SpiritualCardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-secondary/10">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">All-Time Deeds</p>
                <p className="text-2xl font-bold">{allTimeStats.totalGoodDeeds}</p>
              </div>
            </div>
          </SpiritualCardContent>
        </SpiritualCard>

        {/* Average Actions Per Day */}
        <SpiritualCard variant="default">
          <SpiritualCardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg/Day</p>
                <p className="text-2xl font-bold">{allTimeStats.averageActionsPerDay}</p>
              </div>
            </div>
          </SpiritualCardContent>
        </SpiritualCard>

        {/* Consistency Rate */}
        <SpiritualCard variant="default">
          <SpiritualCardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-primary">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Consistency</p>
                <p className="text-2xl font-bold">{allTimeStats.consistencyRate}%</p>
              </div>
            </div>
          </SpiritualCardContent>
        </SpiritualCard>

        {/* Best Day */}
        {personalRecords.bestDay.count > 0 && (
          <SpiritualCard variant="default" className="col-span-2">
            <SpiritualCardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gradient-secondary">
                  <Award className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Best Day Ever</p>
                  <p className="text-lg font-bold">
                    {personalRecords.bestDay.count} actions · {format(new Date(personalRecords.bestDay.date), 'MMM d')}
                  </p>
                </div>
              </div>
            </SpiritualCardContent>
          </SpiritualCard>
        )}

        {/* Monthly Trend */}
        {personalRecords.monthlyChange !== 0 && (
          <SpiritualCard variant="default" className="col-span-2">
            <SpiritualCardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${personalRecords.monthlyChange > 0 ? 'bg-green-500/10' : 'bg-orange-500/10'}`}>
                  <TrendingUp className={`h-5 w-5 ${personalRecords.monthlyChange > 0 ? 'text-green-500' : 'text-orange-500'}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Monthly Trend</p>
                  <p className={`text-lg font-bold ${personalRecords.monthlyChange > 0 ? 'text-green-500' : 'text-orange-500'}`}>
                    {personalRecords.monthlyChange > 0 ? '↗' : '↘'} {Math.abs(personalRecords.monthlyChange)}% ({personalRecords.lastMonthGoodDeeds} → {personalRecords.thisMonthGoodDeeds})
                  </p>
                </div>
              </div>
            </SpiritualCardContent>
          </SpiritualCard>
        )}
      </div>

      {/* Recent Entries */}
      <SpiritualCard variant="peaceful">
        <SpiritualCardHeader>
          <SpiritualCardTitle>Recent Entries</SpiritualCardTitle>
        </SpiritualCardHeader>
        <SpiritualCardContent>
          {entries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Begin your spiritual reflection journey</p>
              <p className="text-sm mt-1">Start logging your deeds and reflections</p>
            </div>
          ) : (
            <div className="space-y-2">
              {entries
                .sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime())
                .slice(0, 7)
                .map(entry => {
                  const entryDate = new Date(entry.dateISO);
                  const goodCount = entry.good?.itemIds?.length || 0;
                  const improveCount = entry.improve?.itemIds?.length || 0;
                  
                  return (
                    <button
                      key={entry.id}
                      onClick={() => navigate(`/entry/${entry.dateISO}`)}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors text-left"
                    >
                      <div>
                        <p className="font-medium">{format(entryDate, 'EEEE, MMMM d, yyyy')}</p>
                        <p className="text-sm text-muted-foreground">
                          {goodCount} good deeds · {improveCount} improvements
                        </p>
                      </div>
                      <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {entry.status || 'complete'}
                      </div>
                    </button>
                  );
                })}
            </div>
          )}
        </SpiritualCardContent>
      </SpiritualCard>

      {/* Quick Guidance */}
      {!todayEntry && (
        <SpiritualCard variant="peaceful">
          <SpiritualCardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Begin Your Spiritual Reflection</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Start logging your deeds and reflections for today. May Allah accept your efforts.
            </p>
            <Button onClick={handleNewEntry}>
              <Edit3 className="mr-2 h-4 w-4" />
              Create Entry
            </Button>
          </SpiritualCardContent>
        </SpiritualCard>
      )}
    </div>
  );
}
