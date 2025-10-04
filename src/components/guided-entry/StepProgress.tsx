import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepProgressProps {
  totalSteps: number;
  currentStep: number;
  completedSteps: number[];
  onStepClick?: (step: number) => void;
}

export function StepProgress({ totalSteps, currentStep, completedSteps, onStepClick }: StepProgressProps) {
  return (
    <div className="flex items-center justify-between gap-1 px-2">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
        const isCompleted = completedSteps.includes(step);
        const isCurrent = step === currentStep;
        const isPast = step < currentStep;
        
        return (
          <React.Fragment key={step}>
            <button
              onClick={() => onStepClick?.(step)}
              disabled={!isPast && !isCurrent}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-all",
                isCurrent && "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2",
                isCompleted && !isCurrent && "bg-primary/20 text-primary",
                !isCurrent && !isCompleted && "bg-muted text-muted-foreground",
                (isPast || isCurrent) && "cursor-pointer hover:scale-110",
                !isPast && !isCurrent && "cursor-not-allowed opacity-50"
              )}
            >
              {isCompleted && !isCurrent ? <Check className="h-4 w-4" /> : step}
            </button>
            {step < totalSteps && (
              <div
                className={cn(
                  "flex-1 h-0.5 transition-colors",
                  isCompleted ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
