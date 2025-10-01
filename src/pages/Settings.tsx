import React from 'react';
import { SettingsView } from '@/components/settings-view';
import { Settings as SettingsType, Entry } from '@/types';

interface SettingsProps {
  settings: SettingsType;
  onSettingsUpdate: (settings: Partial<SettingsType>) => void;
  onPanicDelete: () => void;
  entries: Entry[];
}

export default function Settings({ settings, onSettingsUpdate, onPanicDelete }: SettingsProps) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <SettingsView
        settings={settings}
        onUpdateSettings={onSettingsUpdate}
        onPanicDelete={onPanicDelete}
      />
    </div>
  );
}
