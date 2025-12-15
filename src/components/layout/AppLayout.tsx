import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  onLogout?: () => void;
}

export function AppLayout({ onLogout }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar onLogout={onLogout} />
      {/* Main content - with margin for sidebar on desktop, padding for header on mobile */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 p-4 sm:p-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
