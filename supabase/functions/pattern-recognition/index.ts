import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { entries, period = 'week' } = await req.json();
    
    if (!entries || entries.length === 0) {
      return new Response(
        JSON.stringify({ patterns: null, message: "Not enough data to analyze" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Analyze patterns
    const itemFrequency = new Map();
    const categoryFrequency = new Map();
    let totalGoodDeeds = 0;
    let totalMissedItems = 0;
    
    entries.forEach((entry: any) => {
      if (entry.selectedState?.ids) {
        entry.selectedState.ids.forEach((id: string) => {
          itemFrequency.set(id, (itemFrequency.get(id) || 0) + 1);
          const qty = entry.selectedState.qty?.[id] || 1;
          totalGoodDeeds += qty;
        });
      }
      
      if (entry.categoryState) {
        Object.entries(entry.categoryState).forEach(([category, items]: [string, any]) => {
          if (items?.missed?.length > 0) {
            categoryFrequency.set(category, (categoryFrequency.get(category) || 0) + items.missed.length);
            totalMissedItems += items.missed.length;
          }
        });
      }
    });

    // Find most consistent habits (appear in >70% of entries)
    const consistentHabits = Array.from(itemFrequency.entries())
      .filter(([_, count]) => count / entries.length > 0.7)
      .map(([id, count]) => ({ id, frequency: count }));

    // Find areas needing attention (frequently missed)
    const strugglingAreas = Array.from(categoryFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category, count]) => ({ category, missedCount: count }));

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Generate AI insights
    const systemPrompt = `You are a compassionate Islamic spiritual advisor analyzing patterns in someone's spiritual journey.

Guidelines:
- Provide encouraging, data-driven insights
- Celebrate consistent good habits
- Gently acknowledge areas for growth
- Offer 1-2 practical, achievable suggestions
- Keep tone warm and supportive
- Reference Islamic concepts of gradual improvement (step by step)
- Keep response concise (max 150 words)`;

    const userPrompt = `Analyze this ${period}'s spiritual progress:

Entries analyzed: ${entries.length}
Total good deeds recorded: ${totalGoodDeeds}
Consistent habits: ${consistentHabits.length} practices
${strugglingAreas.length > 0 ? `Areas needing attention: ${strugglingAreas.map(a => a.category).join(', ')}` : 'No major struggles identified'}

Provide encouraging insights and gentle guidance for continued growth.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 250
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('Failed to generate pattern insights');
    }

    const data = await response.json();
    const aiInsight = data.choices[0].message.content;

    return new Response(
      JSON.stringify({
        patterns: {
          consistentHabits,
          strugglingAreas,
          totalGoodDeeds,
          totalMissedItems,
          entriesAnalyzed: entries.length
        },
        aiInsight,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in pattern-recognition:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
