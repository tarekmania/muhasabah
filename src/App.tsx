import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { useStorage } from "@/hooks/use-storage";
import Dashboard from "./pages/Dashboard";
import Entry from "./pages/Entry";
import Templates from "./pages/Templates";
import Ledger from "./pages/Ledger";
import Weekly from "./pages/Weekly";
import History from "./pages/History";
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

  const handleEditEntry = (entry: any) => {
    navigate(`/entry/${entry.dateISO}`);
  };

  const handleSaveIntention = (intention: string) => {
    console.log('Saving weekly intention:', intention);
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col w-full">
          <AppHeader />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard entries={entries} />} />
              <Route path="/entry" element={<Entry entries={entries} onSave={saveEntry} onUpdate={updateEntry} />} />
              <Route path="/entry/:date" element={<Entry entries={entries} onSave={saveEntry} onUpdate={updateEntry} />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/ledger" element={<Ledger entries={entries} />} />
              <Route path="/weekly" element={<Weekly entries={entries} onSaveIntention={handleSaveIntention} />} />
              <Route path="/history" element={<History entries={entries} onEditEntry={handleEditEntry} />} />
              <Route path="/settings" element={<Settings settings={settings} onSettingsUpdate={updateSettings} onPanicDelete={clearAllData} entries={entries} />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
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
