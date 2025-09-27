import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, History, Calendar } from 'lucide-react';

interface AppHeaderProps {
  currentView: 'today' | 'history' | 'settings';
  onViewChange: (view: 'today' | 'history' | 'settings') => void;
}

export function AppHeader({ currentView, onViewChange }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-spiritual flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">م</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-spiritual bg-clip-text text-transparent">
            Muhāsabah
          </h1>
        </div>
        
        <nav className="flex items-center space-x-2">
          <Button
            variant={currentView === 'today' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('today')}
            className={currentView === 'today' ? 'bg-primary text-primary-foreground' : ''}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Today
          </Button>
          <Button
            variant={currentView === 'history' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('history')}
            className={currentView === 'history' ? 'bg-primary text-primary-foreground' : ''}
          >
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
          <Button
            variant={currentView === 'settings' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('settings')}
            className={currentView === 'settings' ? 'bg-primary text-primary-foreground' : ''}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </nav>
      </div>
    </header>
  );
}