import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AIInsightsProps {
  note?: string;
  selectedItems?: string[];
  entries?: any[];
  type: 'reflection' | 'patterns';
}

export function AIInsights({ note, selectedItems, entries, type }: AIInsightsProps) {
  const [insight, setInsight] = useState<string | null>(null);
  const [patterns, setPatterns] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const analyzeReflection = async () => {
    if (!note || note.trim().length === 0) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-reflection`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({ note, selectedItems })
        }
      );

      if (!response.ok) throw new Error('Failed to analyze reflection');
      
      const data = await response.json();
      setInsight(data.insight);
    } catch (error) {
      console.error('Error analyzing reflection:', error);
      toast({
        title: "Analysis unavailable",
        description: "Unable to generate insights at this time",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzePatterns = async () => {
    if (!entries || entries.length === 0) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pattern-recognition`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({ entries, period: 'week' })
        }
      );

      if (!response.ok) throw new Error('Failed to analyze patterns');
      
      const data = await response.json();
      setPatterns(data.patterns);
      setInsight(data.aiInsight);
    } catch (error) {
      console.error('Error analyzing patterns:', error);
      toast({
        title: "Analysis unavailable",
        description: "Unable to generate pattern insights at this time",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (type === 'reflection' && note) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Spiritual Reflection</CardTitle>
          </div>
          <CardDescription>AI-powered gentle guidance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!insight ? (
            <Button 
              onClick={analyzeReflection} 
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {loading ? 'Analyzing...' : 'Get Spiritual Insights'}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <p className="text-sm leading-relaxed">{insight}</p>
              </div>
              <Button 
                onClick={analyzeReflection} 
                disabled={loading}
                variant="ghost"
                size="sm"
                className="w-full"
              >
                Refresh Insight
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (type === 'patterns' && entries) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Growth Patterns</CardTitle>
          </div>
          <CardDescription>Your spiritual journey insights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!patterns ? (
            <Button 
              onClick={analyzePatterns} 
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {loading ? 'Analyzing...' : 'Analyze Progress'}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-primary">{patterns.totalGoodDeeds}</div>
                  <div className="text-xs text-muted-foreground">Good Deeds</div>
                </div>
                <div className="bg-background/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-primary">{patterns.consistentHabits.length}</div>
                  <div className="text-xs text-muted-foreground">Consistent Habits</div>
                </div>
              </div>
              
              {insight && (
                <div className="flex items-start gap-2 bg-background/50 rounded-lg p-3">
                  <Sparkles className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <p className="text-sm leading-relaxed">{insight}</p>
                </div>
              )}

              <Button 
                onClick={analyzePatterns} 
                disabled={loading}
                variant="ghost"
                size="sm"
                className="w-full"
              >
                Refresh Analysis
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
}
