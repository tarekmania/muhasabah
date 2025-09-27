import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spiritualCardVariants = cva(
  "rounded-xl bg-card text-card-foreground transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border border-border shadow-gentle hover:shadow-spiritual",
        elevated: "shadow-spiritual hover:shadow-warm border-0",
        peaceful: "bg-gradient-peace border border-border/50 shadow-gentle",
        blessed: "bg-gradient-spiritual text-primary-foreground shadow-warm hover:shadow-spiritual",
      },
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface SpiritualCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spiritualCardVariants> {}

const SpiritualCard = React.forwardRef<HTMLDivElement, SpiritualCardProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(spiritualCardVariants({ variant, size, className }))}
      {...props}
    />
  )
);

SpiritualCard.displayName = "SpiritualCard";

const SpiritualCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
));

SpiritualCardHeader.displayName = "SpiritualCardHeader";

const SpiritualCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));

SpiritualCardTitle.displayName = "SpiritualCardTitle";

const SpiritualCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));

SpiritualCardDescription.displayName = "SpiritualCardDescription";

const SpiritualCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-4", className)} {...props} />
));

SpiritualCardContent.displayName = "SpiritualCardContent";

const SpiritualCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
));

SpiritualCardFooter.displayName = "SpiritualCardFooter";

export {
  SpiritualCard,
  SpiritualCardHeader,
  SpiritualCardFooter,
  SpiritualCardTitle,
  SpiritualCardDescription,
  SpiritualCardContent,
  spiritualCardVariants,
};