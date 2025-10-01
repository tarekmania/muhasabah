import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings, History, LayoutDashboard, Edit3, Sparkles, BookOpen, TrendingUp } from 'lucide-react';

export function AppHeader() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-spiritual flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">م</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-spiritual bg-clip-text text-transparent">
            Muhāsabah
          </h1>
        </Link>
        
        <nav className="flex items-center space-x-1">
          <Button
            variant={isActive('/') ? 'default' : 'ghost'}
            size="sm"
            asChild
          >
            <Link to="/">
              <LayoutDashboard className="h-4 w-4 mr-1" />
              Dashboard
            </Link>
          </Button>
          <Button
            variant={isActive('/entry') ? 'default' : 'ghost'}
            size="sm"
            asChild
          >
            <Link to="/entry">
              <Edit3 className="h-4 w-4 mr-1" />
              Entry
            </Link>
          </Button>
          <Button
            variant={isActive('/templates') ? 'default' : 'ghost'}
            size="sm"
            asChild
          >
            <Link to="/templates">
              <Sparkles className="h-4 w-4 mr-1" />
              Routines
            </Link>
          </Button>
          <Button
            variant={isActive('/ledger') ? 'default' : 'ghost'}
            size="sm"
            asChild
          >
            <Link to="/ledger">
              <BookOpen className="h-4 w-4 mr-1" />
              Ledger
            </Link>
          </Button>
          <Button
            variant={isActive('/weekly') ? 'default' : 'ghost'}
            size="sm"
            asChild
          >
            <Link to="/weekly">
              <TrendingUp className="h-4 w-4 mr-1" />
              Weekly
            </Link>
          </Button>
          <Button
            variant={isActive('/history') ? 'default' : 'ghost'}
            size="sm"
            asChild
          >
            <Link to="/history">
              <History className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant={isActive('/settings') ? 'default' : 'ghost'}
            size="sm"
            asChild
          >
            <Link to="/settings">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
