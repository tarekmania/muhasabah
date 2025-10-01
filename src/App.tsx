import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/app-header";
import { BottomNav } from "@/components/bottom-nav";
import { useStorage } from "@/hooks/use-storage";
import Dashboard from "./pages/Dashboard";
import Entry from "./pages/Entry";
import Templates from "./pages/Templates";
import Weekly from "./pages/Weekly";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { entries, settings, isLoading, saveEntry, updateEntry, updateSettings, clearAllData } = useStorage();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your spiritual journey...</p>
        </div>
      </div>
    );
  }

  const handleSaveIntention = (intention: string) => {
    console.log('Saving weekly intention:', intention);
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <AppHeader />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard entries={entries} />} />
          <Route path="/entry" element={<Entry entries={entries} onSave={saveEntry} onUpdate={updateEntry} />} />
          <Route path="/entry/:date" element={<Entry entries={entries} onSave={saveEntry} onUpdate={updateEntry} />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/weekly" element={<Weekly entries={entries} onSaveIntention={handleSaveIntention} />} />
          <Route path="/settings" element={<Settings settings={settings} onSettingsUpdate={updateSettings} onPanicDelete={clearAllData} entries={entries} />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
