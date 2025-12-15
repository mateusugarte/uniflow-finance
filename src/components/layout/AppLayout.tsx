import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useState } from "react";

interface AppLayoutProps {
  onLogout?: () => void;
}

export function AppLayout({ onLogout }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar onLogout={onLogout} />
      <main className="flex-1 ml-64 p-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
