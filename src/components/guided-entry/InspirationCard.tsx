import React, { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InspirationCardProps {
  category: string;
  className?: string;
}

const inspirationData: Record<string, { quote: string; reference: string }[]> = {
  prayer: [
    { quote: "The first matter that the slave will be brought to account for on the Day of Judgment is the prayer.", reference: "Sunan al-Tirmidhī 413" },
    { quote: "Between a man and disbelief is abandoning the prayer.", reference: "Sahih Muslim 82" },
    { quote: "Whoever guards the prayers, they will be light and proof and salvation for him on the Day of Resurrection.", reference: "Musnad Ahmad 6576" },
  ],
  quran: [
    { quote: "The best of you are those who learn the Quran and teach it.", reference: "Sahih al-Bukhari 5027" },
    { quote: "Read the Quran, for it will come as an intercessor for its reciters on the Day of Resurrection.", reference: "Sahih Muslim 804" },
    { quote: "Whoever recites a letter from the Book of Allah will receive a reward, and the reward is multiplied by ten.", reference: "Jami' al-Tirmidhi 2910" },
  ],
  character: [
    { quote: "The best among you are those who have the best character and manners.", reference: "Sahih al-Bukhari 6035" },
    { quote: "Nothing is heavier on the Scale than good character.", reference: "Sunan Abi Dawud 4799" },
    { quote: "The most beloved of Allah's servants to Allah are those with the best character.", reference: "Al-Hakim" },
  ],
  family: [
    { quote: "The best of you is the one who is best to his family, and I am the best of you to my family.", reference: "Sunan al-Tirmidhi 3895" },
    { quote: "Paradise lies at the feet of your mother.", reference: "Sunan al-Nasa'i 3104" },
    { quote: "He who does not show mercy to our young ones and respect to our elderly is not one of us.", reference: "Sunan Abi Dawud 4943" },
  ],
  charity: [
    { quote: "Charity does not decrease wealth.", reference: "Sahih Muslim 2588" },
    { quote: "The believer's shade on the Day of Resurrection will be his charity.", reference: "Sunan al-Tirmidhi 604" },
    { quote: "Protect yourself from the Fire even with half a date in charity.", reference: "Sahih al-Bukhari 1417" },
  ],
  default: [
    { quote: "Verily, with hardship comes ease.", reference: "Quran 94:6" },
    { quote: "Take advantage of five before five: your youth before your old age, your health before your illness, your riches before your poverty, your free time before your work, and your life before your death.", reference: "Al-Hakim" },
    { quote: "The strong person is not the one who can overpower others, rather the strong person is the one who controls himself when angry.", reference: "Sahih al-Bukhari 6114" },
  ],
};

export function InspirationCard({ category, className }: InspirationCardProps) {
  const inspiration = useMemo(() => {
    const quotes = inspirationData[category] || inspirationData.default;
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, [category]);

  return (
    <div className={cn(
      "p-4 rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20",
      className
    )}>
      <div className="flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <p className="text-sm leading-relaxed italic">
            "{inspiration.quote}"
          </p>
          <p className="text-xs text-muted-foreground">
            — {inspiration.reference}
          </p>
        </div>
      </div>
    </div>
  );
}
