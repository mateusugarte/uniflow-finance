import { Outlet } from "react-router-dom";
import { Header } from "./Header";

interface AppLayoutProps {
  onLogout?: () => void;
}

export function AppLayout({ onLogout }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header onLogout={onLogout} />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
