import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: LucideIcon;
  variant?: "income" | "expense" | "balance" | "default";
  className?: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
  className,
  delay = 0,
}: StatCardProps) {
  const variantStyles = {
    income: "card-income text-income-foreground",
    expense: "card-expense text-expense-foreground",
    balance: "card-balance text-balance-foreground",
    default: "bg-card text-card-foreground border border-border shadow-md",
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-6 animate-slide-up",
        variantStyles[variant],
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className={cn(
            "text-sm font-medium",
            variant === "default" ? "text-muted-foreground" : "opacity-90"
          )}>
            {title}
          </p>
          <p className="text-2xl md:text-3xl font-bold tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className={cn(
              "text-xs",
              variant === "default" ? "text-muted-foreground" : "opacity-75"
            )}>
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn(
            "p-3 rounded-xl",
            variant === "default" ? "bg-accent" : "bg-white/20"
          )}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
}
