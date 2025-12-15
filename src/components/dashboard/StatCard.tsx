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
    income: "bg-income/5 border border-income/20",
    expense: "bg-expense/5 border border-expense/20",
    balance: "bg-primary/5 border border-primary/20",
    default: "bg-card border border-border/50",
  };

  const iconStyles = {
    income: "bg-income/10 text-income",
    expense: "bg-expense/10 text-expense",
    balance: "bg-primary/10 text-primary",
    default: "bg-muted/50 text-muted-foreground",
  };

  const valueStyles = {
    income: "text-income",
    expense: "text-expense",
    balance: "text-primary",
    default: "text-foreground",
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-5 animate-slide-up transition-all duration-300 hover:scale-[1.02]",
        variantStyles[variant],
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        {Icon && (
          <div className={cn(
            "p-2.5 rounded-xl",
            iconStyles[variant]
          )}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </p>
        <p className={cn(
          "text-2xl font-semibold tracking-tight",
          valueStyles[variant]
        )}>
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
