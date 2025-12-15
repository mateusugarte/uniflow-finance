import { Operation } from "@/types/finance";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate, formatTime } from "@/lib/format";
import { ArrowUpCircle, ArrowDownCircle, MoreHorizontal, Pencil, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OperationItemProps {
  operation: Operation;
  onEdit?: (operation: Operation) => void;
  onDelete?: (id: string) => void;
}

export function OperationItem({ operation, onEdit, onDelete }: OperationItemProps) {
  const isIncome = operation.tipo === "entrada";
  const isSale = operation.tipo === "venda";

  const getStyles = () => {
    if (isIncome) {
      return {
        bgClass: "bg-income/10 text-income",
        textClass: "text-income",
        prefix: "+",
        icon: ArrowUpCircle,
      };
    }
    if (isSale) {
      return {
        bgClass: "bg-orange-500/10 text-orange-500",
        textClass: "text-orange-500",
        prefix: "-",
        icon: ShoppingBag,
      };
    }
    return {
      bgClass: "bg-expense/10 text-expense",
      textClass: "text-expense",
      prefix: "-",
      icon: ArrowDownCircle,
    };
  };

  const styles = getStyles();
  const Icon = styles.icon;

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:shadow-md transition-all duration-200 group animate-fade-in">
      {/* Icon */}
      <div className={cn("p-2.5 rounded-xl", styles.bgClass)}>
        <Icon className="h-5 w-5" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-foreground truncate">{operation.descricao}</p>
          {isSale && (
            <span className="text-xs bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded-full">
              Venda
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          <span>{formatDate(operation.data)}</span>
          <span>•</span>
          <span>{formatTime(operation.hora)}</span>
          <span>•</span>
          <span>{operation.banco}</span>
        </div>
      </div>

      {/* Value */}
      <div className="text-right">
        <p className={cn("font-bold text-lg", styles.textClass)}>
          {styles.prefix} {formatCurrency(operation.valor)}
        </p>
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-card border-border">
          <DropdownMenuItem onClick={() => onEdit?.(operation)}>
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete?.(operation.id)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
