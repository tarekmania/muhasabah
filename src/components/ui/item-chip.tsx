import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Check, Plus } from "lucide-react";

const itemChipVariants = cva(
  "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all duration-300 cursor-pointer border-2 relative",
  {
    variants: {
      variant: {
        good: "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/30 hover:shadow-gentle",
        improve: "border-secondary/30 bg-secondary/10 text-secondary-foreground hover:bg-secondary/20 hover:border-secondary/40 hover:shadow-warm",
        neutral: "border-muted-foreground/20 bg-muted/5 text-muted-foreground hover:bg-muted/10",
      },
      selected: {
        true: "",
        false: "",
      },
      size: {
        sm: "px-2 py-1 text-xs",
        default: "px-3 py-2 text-sm",
        lg: "px-4 py-3 text-base",
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
        onMouseLeave={handleMouseUp}
        {...props}
      >
        {emoji && <span className="text-base">{emoji}</span>}
        <span className="flex-1">{label}</span>
        
        {/* Usage count badge */}
        {usageCount && usageCount > 0 && (
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-background/20 text-current">
            ×{usageCount}
          </span>
        )}
        
        {/* Quantity indicator for selected items */}
        {selected && quantity && quantity > 1 && (
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-background/30 text-current font-bold">
            {quantity}
          </span>
        )}
        
        {/* Selection indicator */}
        {selected ? (
          <Check className="h-4 w-4" />
        ) : showAdd ? (
          <Plus className="h-4 w-4 opacity-60" />
        ) : null}
      </div>
    );
  }
);

ItemChip.displayName = "ItemChip";

export { ItemChip, itemChipVariants };