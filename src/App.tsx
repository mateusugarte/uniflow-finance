import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FinanceProvider } from "@/contexts/FinanceContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Registrar from "./pages/Registrar";
import Historico from "./pages/Historico";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Simple auth state (will be replaced with Supabase auth)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <FinanceProvider>
          <Toaster />
          <Sonner position="top-right" richColors />
          <BrowserRouter>
            <Routes>
              {/* Redirect root to auth */}
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              <Route
                path="/auth"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Auth onLogin={handleLogin} />
                  )
                }
              />

              {/* Protected routes */}
              <Route
                element={
                  isAuthenticated ? (
                    <AppLayout onLogout={handleLogout} />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/registrar" element={<Registrar />} />
                <Route path="/historico" element={<Historico />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </FinanceProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
