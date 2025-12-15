import { useState } from "react";
import { Operation } from "@/types/finance";
import { OperationItem } from "./OperationItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface OperationsListProps {
  operations: Operation[];
  onEdit?: (operation: Operation) => void;
  onDelete?: (id: string) => void;
  itemsPerPage?: number;
}

export function OperationsList({
  operations,
  onEdit,
  onDelete,
  itemsPerPage = 10,
}: OperationsListProps) {
  const [activeTab, setActiveTab] = useState<"all" | "income" | "expense">("all");
  const [page, setPage] = useState(1);

  const filteredOperations = operations.filter((op) => {
    if (activeTab === "income") return op.tipo === "entrada";
    if (activeTab === "expense") return op.tipo === "saida";
    return true;
  });

  const totalPages = Math.ceil(filteredOperations.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedOperations = filteredOperations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value as "all" | "income" | "expense");
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="bg-secondary/50 p-1">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Todas ({operations.length})
          </TabsTrigger>
          <TabsTrigger
            value="income"
            className="data-[state=active]:bg-income data-[state=active]:text-income-foreground"
          >
            Entradas ({operations.filter((o) => o.tipo === "entrada").length})
          </TabsTrigger>
          <TabsTrigger
            value="expense"
            className="data-[state=active]:bg-expense data-[state=active]:text-expense-foreground"
          >
            Saídas ({operations.filter((o) => o.tipo === "saida").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {paginatedOperations.length > 0 ? (
            <div className="space-y-3">
              {paginatedOperations.map((operation) => (
                <OperationItem
                  key={operation.id}
                  operation={operation}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Nenhuma operação encontrada</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredOperations.length)} de{" "}
            {filteredOperations.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-2">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
