import React from 'react';
import { Button } from '@/components/ui/button';
import { SpiritualCard, SpiritualCardContent, SpiritualCardHeader, SpiritualCardTitle } from '@/components/ui/spiritual-card';
import { ChevronLeft, ChevronRight, Save, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JourneyStepProps {
  stepNumber: number;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  onSaveDraft?: () => void;
  canSkip?: boolean;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  nextLabel?: string;
  className?: string;
}

export function JourneyStep({
  stepNumber,
  title,
  icon,
  children,
  onNext,
  onBack,
  onSkip,
  onSaveDraft,
  canSkip = false,
  isFirstStep = false,
  isLastStep = false,
  nextLabel = "Next",
  className,
}: JourneyStepProps) {
  return (
    <SpiritualCard variant="elevated" className={cn("animate-fade-in", className)}>
      <SpiritualCardHeader>
        <div className="flex items-center justify-between">
          <SpiritualCardTitle className="flex items-center gap-2 text-lg">
            {icon}
            <span>{title}</span>
          </SpiritualCardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Step {stepNumber}/9
            </span>
          </div>
        </div>
      </SpiritualCardHeader>
      <SpiritualCardContent className="space-y-6">
        {/* Step Content */}
        <div className="min-h-[200px]">
          {children}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t gap-2">
          <div className="flex gap-2">
            {!isFirstStep && onBack && (
              <Button variant="outline" onClick={onBack} size="lg">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            {onSaveDraft && (
              <Button variant="ghost" onClick={onSaveDraft} size="lg" className="text-muted-foreground">
                <Save className="h-4 w-4 mr-1" />
                Save Draft
              </Button>
            )}
            
            {canSkip && onSkip && (
              <Button variant="outline" onClick={onSkip} size="lg">
                <SkipForward className="h-4 w-4 mr-1" />
                Skip
              </Button>
            )}

            {onNext && (
              <Button onClick={onNext} size="lg">
                {nextLabel}
                {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
              </Button>
            )}
          </div>
        </div>
      </SpiritualCardContent>
    </SpiritualCard>
  );
}
