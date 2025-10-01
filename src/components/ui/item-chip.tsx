import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Check, Plus } from "lucide-react";

const itemChipVariants = cva(
  "inline-flex items-center gap-2 rounded-full px-4 py-3 text-base font-medium transition-all duration-300 cursor-pointer border-2 relative min-h-[44px]",
  {
    variants: {
      variant: {
        good: "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/30 hover:shadow-gentle active:scale-95",
        improve: "border-secondary/30 bg-secondary/10 text-secondary-foreground hover:bg-secondary/20 hover:border-secondary/40 hover:shadow-warm active:scale-95",
        severe: "border-red-300 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-400 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950/30 active:scale-95",
        missed_opportunity: "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-400 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800 dark:hover:bg-amber-950/30 active:scale-95",
        neutral: "border-muted-foreground/20 bg-muted/5 text-muted-foreground hover:bg-muted/10 active:scale-95",
      },
      selected: {
        true: "",
        false: "",
      },
      size: {
        sm: "px-3 py-2 text-sm min-h-[36px]",
        default: "px-4 py-3 text-base min-h-[44px]",
        lg: "px-5 py-4 text-lg min-h-[52px]",
      },
    },
    compoundVariants: [
      {
        variant: "good",
        selected: true,
        class: "bg-primary text-primary-foreground border-primary shadow-spiritual",
      },
      {
        variant: "improve",
        selected: true,
        class: "bg-secondary text-secondary-foreground border-secondary shadow-warm",
      },
      {
        variant: "severe",
        selected: true,
        class: "bg-red-600 text-red-50 border-red-600 shadow-lg dark:bg-red-700 dark:border-red-700",
      },
      {
        variant: "missed_opportunity",
        selected: true,
        class: "bg-amber-600 text-amber-50 border-amber-600 shadow-lg dark:bg-amber-700 dark:border-amber-700",
      },
      {
        variant: "neutral",
        selected: true,
        class: "bg-muted-foreground text-background border-muted-foreground",
      },
    ],
    defaultVariants: {
      variant: "neutral",
      selected: false,
      size: "default",
    },
  }
);

export interface ItemChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof itemChipVariants> {
  emoji?: string;
  label: string;
  selected?: boolean;
  usageCount?: number;
  quantity?: number;
  onToggle?: () => void;
  onLongPress?: () => void;
  showAdd?: boolean;
}

const ItemChip = React.forwardRef<HTMLDivElement, ItemChipProps>(
  ({ 
    className, 
    variant, 
    size, 
    selected, 
    emoji, 
    label, 
    usageCount, 
    quantity,
    onToggle, 
    onLongPress,
    showAdd = false,
    ...props 
  }, ref) => {
    const [isLongPressing, setIsLongPressing] = React.useState(false);
    const longPressTimer = React.useRef<NodeJS.Timeout>();

    const handleTouchStart = () => {
      setIsLongPressing(false);
      longPressTimer.current = setTimeout(() => {
        setIsLongPressing(true);
        onLongPress?.();
      }, 500);
    };

    const handleTouchEnd = () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
      if (!isLongPressing) {
        onToggle?.();
      }
      setIsLongPressing(false);
    };

    const handleMouseDown = () => {
      longPressTimer.current = setTimeout(() => {
        setIsLongPressing(true);
        onLongPress?.();
      }, 500);
    };

    const handleMouseUp = () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
      if (!isLongPressing) {
        onToggle?.();
      }
      setIsLongPressing(false);
    };

    const handleMouseLeave = () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
      setIsLongPressing(false);
    };

    React.useEffect(() => {
      return () => {
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
        }
      };
    }, []);

    return (
      <div
        className={cn(itemChipVariants({ variant, size, selected, className }))}
        ref={ref}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {emoji && <span className="text-xl">{emoji}</span>}
        <span className="flex-1">{label}</span>
        
        {/* Usage count badge */}
        {usageCount && usageCount > 0 && (
          <span className="text-xs px-2 py-1 rounded-full bg-background/20 text-current">
            ×{usageCount}
          </span>
        )}
        
        {/* Quantity indicator for selected items */}
        {selected && quantity && quantity > 1 && (
          <span className="text-sm px-2 py-1 rounded-full bg-background/30 text-current font-bold">
            {quantity}
          </span>
        )}
        
        {/* Selection indicator */}
        {selected ? (
          <Check className="h-5 w-5" />
        ) : showAdd ? (
          <Plus className="h-5 w-5 opacity-60" />
        ) : null}
      </div>
    );
  }
);

ItemChip.displayName = "ItemChip";

export { ItemChip, itemChipVariants };