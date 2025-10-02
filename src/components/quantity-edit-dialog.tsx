import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus } from 'lucide-react';

interface QuantityEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemTitle: string;
  itemEmoji: string;
  currentQuantity: number;
  onSave: (newQuantity: number) => void;
}

export function QuantityEditDialog({
  isOpen,
  onClose,
  itemTitle,
  itemEmoji,
  currentQuantity,
  onSave,
}: QuantityEditDialogProps) {
  const [quantity, setQuantity] = useState(currentQuantity);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(1, prev - 1));
  
  const quickAmounts = [1, 3, 5, 10, 25, 50];

  const handleSave = () => {
    onSave(quantity);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{itemEmoji}</span>
            Edit Quantity
          </DialogTitle>
          <DialogDescription>{itemTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Quantity Display */}
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">
              {quantity}
            </div>
            <p className="text-sm text-muted-foreground">Times performed</p>
          </div>

          {/* Manual Controls */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="h-12 w-12"
            >
              <Minus className="h-5 w-5" />
            </Button>

            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="text-center text-2xl font-bold h-12"
            />

            <Button
              variant="outline"
              size="icon"
              onClick={handleIncrement}
              className="h-12 w-12"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <p className="text-sm font-medium mb-3 text-muted-foreground">Quick amounts</p>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map(amount => (
                <Button
                  key={amount}
                  variant={quantity === amount ? "default" : "outline"}
                  onClick={() => setQuantity(amount)}
                  className="h-12"
                >
                  {amount}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
