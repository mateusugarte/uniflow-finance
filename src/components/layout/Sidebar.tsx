import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PlusCircle, History, LogOut, Menu, X, User, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserSwitch } from "@/contexts/UserSwitchContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/registrar", label: "Registrar", icon: PlusCircle },
  { path: "/historico", label: "Histórico", icon: History },
];

export function Sidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const { selectedUserProfile, allUsers, switchUser, selectedUserId } = useUserSwitch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
  };

  const displayName = selectedUserProfile?.nome || selectedUserProfile?.email?.split("@")[0] || "Usuário";
  const displayEmail = selectedUserProfile?.email || "";

  const handleSwitchUser = (userId: string) => {
    switchUser(userId);
    setUserPopoverOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo - centered with more spacing */}
      <div className="pt-10 pb-8 flex justify-center">
        <Link 
          to="/dashboard" 
          className="group" 
          onClick={() => setMobileOpen(false)}
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/20 overflow-hidden backdrop-blur-sm">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-[140%] h-[140%] object-cover"
            />
          </div>
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Navigation - with more top spacing */}
      <nav className="flex-1 px-4 pt-10 space-y-2">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "group flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 animate-fade-in",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50 border border-transparent"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Icon className={cn(
                "h-5 w-5 flex-shrink-0 transition-transform duration-300",
                isActive ? "text-primary" : "group-hover:scale-110"
              )} />
              <span className="tracking-wide">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer with User Info */}
      <div className="p-4 mt-auto">
        {/* User Switcher */}
        <Popover open={userPopoverOpen} onOpenChange={setUserPopoverOpen}>
          <PopoverTrigger asChild>
            <button className="w-full px-3 py-3 mb-3 rounded-xl bg-secondary/50 border border-border/50 hover:bg-secondary/70 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{displayEmail}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
              <p className="text-xs text-primary mt-2 pl-12">Trocar usuário</p>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" align="start" side="top">
            <p className="text-xs font-medium text-muted-foreground px-2 py-1 mb-1">Selecione um usuário</p>
            <div className="max-h-[200px] overflow-y-auto space-y-1">
              {allUsers.map((userProfile) => (
                <button
                  key={userProfile.id}
                  onClick={() => handleSwitchUser(userProfile.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left transition-colors",
                    selectedUserId === userProfile.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-accent text-foreground"
                  )}
                >
                  <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {userProfile.nome || userProfile.email?.split("@")[0]}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{userProfile.email}</p>
                  </div>
                  {selectedUserId === userProfile.id && (
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <div className="mx-2 mb-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setMobileOpen(false);
            handleLogout();
          }}
          className="w-full justify-start text-muted-foreground hover:text-expense hover:bg-expense/10 rounded-xl py-3 transition-all duration-300"
        >
          <LogOut className="h-4 w-4 mr-3" />
          <span className="tracking-wide">Sair</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar-background/95 backdrop-blur-xl border-b border-border/50 z-50 flex items-center justify-between px-5">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="Logo" className="w-[200%] h-[200%] object-cover scale-150" />
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground truncate max-w-[120px]">{displayName}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-foreground hover:bg-accent/50 rounded-xl"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed top-16 left-0 bottom-0 w-72 bg-sidebar-background/95 backdrop-blur-xl border-r border-border/50 z-50 transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 bg-sidebar-background/95 backdrop-blur-xl border-r border-border/30 flex-col z-50">
        <SidebarContent />
      </aside>
    </>
  );
}
