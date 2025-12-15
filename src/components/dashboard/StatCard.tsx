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
    income: "bg-income/15 border border-income/30 text-foreground",
    expense: "bg-expense/15 border border-expense/30 text-foreground",
    balance: "bg-balance/15 border border-balance/30 text-foreground",
    default: "bg-card border border-border text-card-foreground",
  };

  const iconStyles = {
    income: "bg-income text-income-foreground",
    expense: "bg-expense text-expense-foreground",
    balance: "bg-balance text-balance-foreground",
    default: "bg-accent text-accent-foreground",
  };

  const valueStyles = {
    income: "text-income",
    expense: "text-expense",
    balance: "text-balance",
    default: "text-foreground",
  };

  return (
    <div
      className={cn(
        "rounded-xl p-5 animate-slide-up transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg",
        variantStyles[variant],
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>
          <p className={cn(
            "text-2xl md:text-3xl font-bold tracking-tight",
            valueStyles[variant]
          )}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn(
            "p-2.5 rounded-lg",
            iconStyles[variant]
          )}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}
