import { Operation } from "@/types/finance";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate, formatTime } from "@/lib/format";
import { ArrowUpCircle, ArrowDownCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:shadow-md transition-all duration-200 group animate-fade-in">
      {/* Icon */}
      <div
        className={cn(
          "p-2.5 rounded-xl",
          isIncome ? "bg-income/10 text-income" : "bg-expense/10 text-expense"
        )}
      >
        {isIncome ? (
          <ArrowUpCircle className="h-5 w-5" />
        ) : (
          <ArrowDownCircle className="h-5 w-5" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{operation.descricao}</p>
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
        <p
          className={cn(
            "font-bold text-lg",
            isIncome ? "text-income" : "text-expense"
          )}
        >
          {isIncome ? "+" : "-"} {formatCurrency(operation.valor)}
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
