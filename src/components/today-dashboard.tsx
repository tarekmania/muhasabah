import React, { useMemo } from 'react';
import { SpiritualCard, SpiritualCardContent, SpiritualCardHeader, SpiritualCardTitle } from '@/components/ui/spiritual-card';
import { Clock, TrendingUp, Flame, Moon, Sun, Sunrise, Sunset } from 'lucide-react';
import { Entry } from '@/types';

interface TodayDashboardProps {
  entries: Entry[];
  todayEntry?: Entry | null;
}

export function TodayDashboard({ entries, todayEntry }: TodayDashboardProps) {
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

    const goodCount = todayEntry.good?.itemIds.length || 0;
    const improveCount = todayEntry.improve?.itemIds.length || 0;
    const totalActions = goodCount + improveCount;

    return { goodCount, improveCount, totalActions };
  }, [todayEntry]);

  return (
    <div className="space-y-4 max-w-4xl mx-auto p-4">
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

      {/* Streak and Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Entries</p>
                <p className="text-2xl font-bold">{entries.length}</p>
              </div>
            </div>
          </SpiritualCardContent>
        </SpiritualCard>
      </div>

      {/* Quick Guidance */}
      {!todayEntry && (
        <SpiritualCard variant="peaceful">
          <SpiritualCardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Begin Your Spiritual Reflection</h3>
            <p className="text-muted-foreground text-sm">
              Start logging your deeds and reflections for today. May Allah accept your efforts.
            </p>
          </SpiritualCardContent>
        </SpiritualCard>
      )}
    </div>
  );
}
