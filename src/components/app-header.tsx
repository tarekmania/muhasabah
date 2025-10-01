import React from 'react';
import { Link } from 'react-router-dom';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-spiritual flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">م</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-spiritual bg-clip-text text-transparent">
            Muhāsabah
          </h1>
        </Link>
      </div>
    </header>
  );
}
