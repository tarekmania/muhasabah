import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { note, selectedItems } = await req.json();
    
    if (!note || note.trim().length === 0) {
      return new Response(
        JSON.stringify({ insight: null, message: "No reflection to analyze" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build context about selected items
    const itemsContext = selectedItems && selectedItems.length > 0 
      ? `\n\nToday's spiritual activities: ${selectedItems.join(', ')}`
      : '';

    const systemPrompt = `You are a compassionate Islamic spiritual advisor providing gentle, encouraging guidance based on personal reflections. 

Guidelines:
- Be warm, supportive, and non-judgmental
- Provide 2-3 sentences of Islamic encouragement
- Reference relevant Quranic verses or Hadith when appropriate (keep it brief)
- Focus on hope, mercy, and continuous improvement
- Acknowledge both struggles and successes with empathy
- Keep response concise and uplifting (max 100 words)

Remember: The goal is to encourage, not to lecture or overwhelm.`;

    const userPrompt = `Please provide gentle Islamic guidance based on this personal reflection:

"${note}"${itemsContext}

Respond with encouraging words that acknowledge their feelings and provide spiritual support.`;

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
        max_tokens: 200
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('Failed to analyze reflection');
    }

    const data = await response.json();
    const insight = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ 
        insight,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-reflection:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
