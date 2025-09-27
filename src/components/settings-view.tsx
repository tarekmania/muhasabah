import React, { useState } from 'react';
import { SpiritualCard, SpiritualCardHeader, SpiritualCardTitle, SpiritualCardContent } from '@/components/ui/spiritual-card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Shield, Bell, Trash2, Moon, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type Settings } from '@/types';

interface SettingsViewProps {
  settings: Settings;
  onUpdateSettings: (settings: Partial<Settings>) => void;
  onPanicDelete: () => void;
}

export function SettingsView({ settings, onUpdateSettings, onPanicDelete }: SettingsViewProps) {
  const [reminderTime, setReminderTime] = useState({
    hour: settings.reminderHour,
    minute: settings.reminderMinute
  });
  const [showPanicConfirm, setShowPanicConfirm] = useState(false);
  const { toast } = useToast();

  const handleTimeChange = (field: 'hour' | 'minute', value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;

    const newTime = { ...reminderTime, [field]: numValue };
    setReminderTime(newTime);
    onUpdateSettings({ 
      reminderHour: newTime.hour, 
      reminderMinute: newTime.minute 
    });
  };

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const handlePanicDelete = () => {
    if (!showPanicConfirm) {
      setShowPanicConfirm(true);
      setTimeout(() => setShowPanicConfirm(false), 5000); // Auto-hide after 5 seconds
      return;
    }
    
    onPanicDelete();
    setShowPanicConfirm(false);
    toast({
      title: "All data deleted",
      description: "Your privacy is protected.",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground">Customize your Muhāsabah experience</p>
      </div>

      {/* Reminder Settings */}
      <SpiritualCard variant="peaceful">
        <SpiritualCardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <SpiritualCardTitle>Daily Reminders</SpiritualCardTitle>
          </div>
        </SpiritualCardHeader>
        <SpiritualCardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reminder-time" className="text-sm font-medium">
                Reminder time (after ʿIshā')
              </Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  type="number"
                  min="0"
                  max="23"
                  value={reminderTime.hour}
                  onChange={(e) => handleTimeChange('hour', e.target.value)}
                  className="w-20"
                />
                <span>:</span>
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={reminderTime.minute}
                  onChange={(e) => handleTimeChange('minute', e.target.value)}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground ml-2">
                  ({formatTime(reminderTime.hour, reminderTime.minute)})
                </span>
              </div>
            </div>
          </div>
        </SpiritualCardContent>
      </SpiritualCard>

      {/* Privacy & Security */}
      <SpiritualCard variant="elevated">
        <SpiritualCardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <SpiritualCardTitle>Privacy & Security</SpiritualCardTitle>
          </div>
        </SpiritualCardHeader>
        <SpiritualCardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="biometric-lock">Biometric Lock</Label>
                <p className="text-sm text-muted-foreground">
                  Require biometric authentication to open the app
                </p>
              </div>
              <Switch
                id="biometric-lock"
                checked={settings.biometricLock}
                onCheckedChange={(checked) => onUpdateSettings({ biometricLock: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="private-mode">Private Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Disable all analytics and cloud features
                </p>
              </div>
              <Switch
                id="private-mode"
                checked={settings.privateMode}
                onCheckedChange={(checked) => onUpdateSettings({ privateMode: checked })}
              />
            </div>
          </div>
        </SpiritualCardContent>
      </SpiritualCard>

      {/* Emergency */}
      <SpiritualCard variant="default" className="border-destructive/20">
        <SpiritualCardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <SpiritualCardTitle className="text-destructive">Emergency</SpiritualCardTitle>
          </div>
        </SpiritualCardHeader>
        <SpiritualCardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              In case of emergency, you can permanently delete all your data from this device.
            </p>
            <Button
              variant="destructive"
              onClick={handlePanicDelete}
              className={showPanicConfirm ? "bg-destructive/80" : ""}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {showPanicConfirm ? "Tap again to confirm deletion" : "Panic Delete All Data"}
            </Button>
            {showPanicConfirm && (
              <p className="text-xs text-destructive">
                Warning: This action cannot be undone. All entries will be permanently deleted.
              </p>
            )}
          </div>
        </SpiritualCardContent>
      </SpiritualCard>

      {/* App Info */}
      <SpiritualCard variant="peaceful">
        <SpiritualCardContent>
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-gradient-spiritual flex items-center justify-center mx-auto">
              <span className="text-xl font-bold text-primary-foreground">م</span>
            </div>
            <h3 className="font-semibold">Muhāsabah</h3>
            <p className="text-sm text-muted-foreground">
              "And it is He who created the heavens and earth in truth. And the day He says, 'Be,' and it is, His word is the truth." - Qur'an 6:73
            </p>
            <p className="text-xs text-muted-foreground">
              Version 1.0.0 • Privacy-first • Local storage only
            </p>
          </div>
        </SpiritualCardContent>
      </SpiritualCard>
    </div>
  );
}