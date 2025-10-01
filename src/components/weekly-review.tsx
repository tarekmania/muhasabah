import React, { useState } from 'react';
import { Entry, CatalogItem, WeeklySummary } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TrendingUp, Heart, Target, Sparkles } from 'lucide-react';
import { AIInsights } from './ai-insights';

interface WeeklyReviewProps {
  entries: Entry[];
  catalogItems: CatalogItem[];
  weekStart: string;
  weekEnd: string;
  onSaveIntention: (intention: string) => void;
}

export function WeeklyReview({
  entries,
  catalogItems,
  weekStart,
  weekEnd,
  onSaveIntention
}: WeeklyReviewProps) {
  const [intention, setIntention] = useState('');

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const getItemById = (id: string) => {
    return catalogItems.find(item => item.id === id);
  };

  // Analyze weekly data
  const analyzeWeeklyData = () => {
    const itemCounts: Record<string, { count: number; type: string; days: number[] }> = {};
    
    entries.forEach((entry, dayIndex) => {
      // Process good deeds
      entry.good?.itemIds?.forEach(itemId => {
        const count = entry.good?.qty?.[itemId] || 1;
        if (!itemCounts[itemId]) {
          itemCounts[itemId] = { count: 0, type: 'GOOD', days: new Array(7).fill(0) };
        }
        itemCounts[itemId].count += count;
        itemCounts[itemId].days[dayIndex] += count;
      });

      // Process areas to improve
      entry.improve?.itemIds?.forEach(itemId => {
        const count = entry.improve?.qty?.[itemId] || 1;
        if (!itemCounts[itemId]) {
          itemCounts[itemId] = { count: 0, type: 'IMPROVE', days: new Array(7).fill(0) };
        }
        itemCounts[itemId].count += count;
        itemCounts[itemId].days[dayIndex] += count;
      });
    });

    // Find most consistent good deed (appeared most days)
    const goodDeeds = Object.entries(itemCounts)
      .filter(([_, data]) => data.type === 'GOOD')
      .map(([itemId, data]) => ({
        itemId,
        count: data.count,
        consistency: data.days.filter(day => day > 0).length,
        title: getItemById(itemId)?.title || itemId
      }))
      .sort((a, b) => b.consistency - a.consistency || b.count - a.count);

    // Find most frequent improvement area
    const improvements = Object.entries(itemCounts)
      .filter(([_, data]) => data.type === 'IMPROVE')
      .map(([itemId, data]) => ({
        itemId,
        count: data.count,
        title: getItemById(itemId)?.title || itemId
      }))
      .sort((a, b) => b.count - a.count);

    // Get top 3 items for sparklines
    const topItems = Object.entries(itemCounts)
      .map(([itemId, data]) => ({
        itemId,
        title: getItemById(itemId)?.title || itemId,
        counts: data.days,
        type: data.type,
        totalCount: data.count
      }))
      .sort((a, b) => b.totalCount - a.totalCount)
      .slice(0, 3);

    return {
      mostConsistentGood: goodDeeds[0],
      mostFrequentImprovement: improvements[0],
      topItems
    };
  };

  const { mostConsistentGood, mostFrequentImprovement, topItems } = analyzeWeeklyData();

  // Simple sparkline component
  const Sparkline = ({ data, color = '#10b981' }: { data: number[]; color?: string }) => {
    const max = Math.max(...data, 1);
    const width = 100;
    const height = 30;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - (value / max) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} className="inline-block">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * width;
          const y = height - (value / max) * height;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill={color}
              opacity={value > 0 ? 1 : 0.3}
            />
          );
        })}
      </svg>
    );
  };

  const handleSaveIntention = () => {
    if (intention.trim()) {
      onSaveIntention(intention.trim());
      setIntention('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <TrendingUp className="h-6 w-6 text-green-500" />
          Weekly Review
        </h2>
        <p className="text-muted-foreground">
          {formatDateRange(weekStart, weekEnd)}
        </p>
      </div>

      {/* Mercy-first introduction */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <Heart className="h-8 w-8 text-red-500 mx-auto" />
            <p className="text-lg font-medium text-green-800">
              Allah's Mercy Encompasses All Things
            </p>
            <p className="text-sm text-green-700">
              This review is for reflection and growth, not judgment. 
              Remember that Allah is Oft-Forgiving, Most Merciful.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Consistent Good Deed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Sparkles className="h-5 w-5" />
              Most Consistent Good
            </CardTitle>
            <CardDescription>
              The good deed you practiced most consistently this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mostConsistentGood ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {getItemById(mostConsistentGood.itemId)?.emoji}
                  </span>
                  <div>
                    <p className="font-medium">{mostConsistentGood.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {mostConsistentGood.consistency} days • {mostConsistentGood.count} total
                    </p>
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Alhamdulillah!</strong> Your consistency in this good deed shows 
                    beautiful commitment to your spiritual growth.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <p>No consistent patterns found this week.</p>
                <p className="text-sm">Every small step counts in your journey.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Most Frequent Improvement Area */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Target className="h-5 w-5" />
              Growth Opportunity
            </CardTitle>
            <CardDescription>
              An area where Allah is guiding you toward improvement
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mostFrequentImprovement ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {getItemById(mostFrequentImprovement.itemId)?.emoji}
                  </span>
                  <div>
                    <p className="font-medium">{mostFrequentImprovement.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {mostFrequentImprovement.count} occurrences
                    </p>
                  </div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-sm text-orange-800">
                    Recognizing this pattern is the first step toward positive change. 
                    Allah guides those who seek improvement.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <p>No improvement areas logged this week.</p>
                <p className="text-sm">Self-reflection is a continuous journey.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trends with Sparklines */}
      {topItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Trends</CardTitle>
            <CardDescription>
              Your spiritual activity patterns throughout the week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topItems.map((item) => {
                const itemData = getItemById(item.itemId);
                const color = item.type === 'GOOD' ? '#10b981' : '#f59e0b';
                
                return (
                  <div key={item.itemId} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{itemData?.emoji}</span>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.totalCount} total this week
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Sparkline data={item.counts} color={color} />
                      <Badge 
                        variant="outline" 
                        className={item.type === 'GOOD' ? 'text-green-700' : 'text-orange-700'}
                      >
                        {item.type === 'GOOD' ? 'Good' : 'Improve'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 text-xs text-muted-foreground text-center">
              <p>Each dot represents a day • Lines show your weekly pattern</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Intention Setting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Set One Small Intention
          </CardTitle>
          <CardDescription>
            Choose one gentle intention for the coming week
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="I intend to... (e.g., 'remember Allah more often during my commute' or 'be more patient with my family')"
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Small, consistent steps lead to lasting change
            </p>
            <Button 
              onClick={handleSaveIntention}
              disabled={!intention.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Set Intention
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Pattern Recognition */}
      {entries.length > 0 && (
        <AIInsights
          entries={entries}
          type="patterns"
        />
      )}

      {/* Closing reminder */}
      <div className="text-center text-sm text-muted-foreground bg-muted/20 p-4 rounded-lg border">
        <p className="italic">
          "And whoever relies upon Allah - then He is sufficient for him. 
          Indeed, Allah will accomplish His purpose." - Quran 65:3
        </p>
      </div>
    </div>
  );
}
