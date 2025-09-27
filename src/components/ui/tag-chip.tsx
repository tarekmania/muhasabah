import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tagChipVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300 cursor-pointer border-2",
  {
    variants: {
      category: {
        good: "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/30 hover:shadow-gentle",
        improve: "border-secondary/30 bg-secondary/10 text-secondary-foreground hover:bg-secondary/20 hover:border-secondary/40 hover:shadow-warm",
      },
      selected: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        category: "good",
        selected: true,
        class: "bg-primary text-primary-foreground border-primary shadow-spiritual",
      },
      {
        category: "improve",
        selected: true,
        class: "bg-secondary text-secondary-foreground border-secondary shadow-warm",
      },
    ],
    defaultVariants: {
      category: "good",
      selected: false,
    },
  }
);

export interface TagChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagChipVariants> {
  label: string;
  selected?: boolean;
  onToggle?: () => void;
}

const TagChip = React.forwardRef<HTMLDivElement, TagChipProps>(
  ({ className, category, selected, label, onToggle, ...props }, ref) => {
    return (
      <div
        className={cn(tagChipVariants({ category, selected, className }))}
        ref={ref}
        onClick={onToggle}
        {...props}
      >
        {label}
      </div>
    );
  }
);

TagChip.displayName = "TagChip";

export { TagChip, tagChipVariants };