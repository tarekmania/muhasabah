import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Minus } from 'lucide-react';

interface QuantitySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  itemTitle: string;
  itemEmoji?: string;
  currentQuantity: number;
  onQuantityChange: (quantity: number) => void;
  onConfirm: (quantity: number) => void;
}

export function QuantitySelector({
  isOpen,
  onClose,
  itemTitle,
  itemEmoji,
  currentQuantity,
  onQuantityChange,
  onConfirm,
}: QuantitySelectorProps) {
  const quickAmounts = [1, 3, 5, 10, 25, 50, 100];

  const handleIncrement = () => {
    onQuantityChange(currentQuantity + 1);
  };

  const handleDecrement = () => {
    if (currentQuantity > 1) {
      onQuantityChange(currentQuantity - 1);
    }
  };

  const handleQuickAmount = (amount: number) => {
    onQuantityChange(amount);
  };

  const handleConfirm = () => {
    onConfirm(currentQuantity);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {itemEmoji && <span>{itemEmoji}</span>}
            Set Quantity for {itemTitle}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Quantity Display */}
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {currentQuantity}
            </div>
            <p className="text-sm text-muted-foreground">
              Times performed today
            </p>
          </div>

          {/* Manual Input */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecrement}
              disabled={currentQuantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <div className="flex-1">
              <Label htmlFor="quantity" className="sr-only">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="1000"
                value={currentQuantity}
                onChange={(e) => onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
                className="text-center"
              />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleIncrement}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Quick amounts
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map(amount => (
                <Button
                  key={amount}
                  variant={currentQuantity === amount ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleQuickAmount(amount)}
                  className="text-xs"
                >
                  {amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleConfirm} className="flex-1">
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}