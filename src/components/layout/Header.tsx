import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PlusCircle, History, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/registrar", label: "Registrar", icon: PlusCircle },
  { path: "/historico", label: "Histórico", icon: History },
];

interface HeaderProps {
  onLogout?: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <img 
              src="/logo.jpeg" 
              alt="Uni Capital" 
              className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
            />
            <span className="hidden sm:block font-bold text-lg text-gradient">
              Uni Capital
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          {onLogout && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Sair</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
