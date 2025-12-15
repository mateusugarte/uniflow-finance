import { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { Operation } from "@/types/finance";
import { MonthSelector } from "@/components/dashboard/MonthSelector";
import { StatCard } from "@/components/dashboard/StatCard";
import { OperationItem } from "@/components/dashboard/OperationItem";
import { formatCurrency, formatPercent, formatFullDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Search,
  Clock,
} from "lucide-react";

export default function Historico() {
  const {
    selectedMonth,
    setSelectedMonth,
    getMonthlyStats,
    getOperationsByMonth,
    deleteOperation,
  } = useFinance();

  const [search, setSearch] = useState("");
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth();

  const stats = getMonthlyStats(year, month);
  const allOperations = getOperationsByMonth(year, month);

  const filteredOperations = allOperations.filter((op) =>
    op.descricao.toLowerCase().includes(search.toLowerCase()) ||
    op.banco.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = () => {
    if (deleteId) {
      deleteOperation(deleteId);
      setDeleteId(null);
    }
  };

  // Calculate some extra stats
  const avgTicket = stats.totalOperacoes > 0
    ? (stats.totalEntradas + stats.totalSaidas) / stats.totalOperacoes
    : 0;

  const entradas = allOperations.filter(op => op.tipo === "entrada");
  const saidas = allOperations.filter(op => op.tipo === "saida");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Histórico</h1>
          <p className="text-muted-foreground mt-1">
            Análise detalhada das suas operações
          </p>
        </div>
        <MonthSelector
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Operações"
          value={stats.totalOperacoes.toString()}
          icon={Activity}
          delay={0}
        />
        <StatCard
          title="Número de Entradas"
          value={entradas.length.toString()}
          subtitle={formatCurrency(stats.totalEntradas)}
          icon={TrendingUp}
          delay={100}
        />
        <StatCard
          title="Número de Saídas"
          value={saidas.length.toString()}
          subtitle={formatCurrency(stats.totalSaidas)}
          icon={TrendingDown}
          delay={200}
        />
        <StatCard
          title="Ticket Médio"
          value={formatCurrency(avgTicket)}
          subtitle="por operação"
          icon={BarChart3}
          delay={300}
        />
      </div>

      {/* Main Balance Card */}
      <div className="card-balance rounded-2xl p-8 text-balance-foreground animate-slide-up" style={{ animationDelay: "400ms" }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-lg opacity-90">Saldo do Período</p>
            <p className="text-4xl md:text-5xl font-bold mt-2">
              {formatCurrency(stats.saldoLiquido)}
            </p>
          </div>
          <div className="flex flex-col gap-2 text-right">
            <div className="flex items-center gap-2 justify-end opacity-90">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Taxa de Economia</span>
            </div>
            <p className="text-3xl font-bold">
              {formatPercent(stats.taxaEconomia)}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por descrição ou banco..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 bg-card"
          />
        </div>
      </div>

      {/* Operations Table */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-md animate-slide-up" style={{ animationDelay: "500ms" }}>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Todas as Operações ({filteredOperations.length})
        </h2>
        
        {filteredOperations.length > 0 ? (
          <div className="space-y-3">
            {filteredOperations.map((operation) => (
              <OperationItem
                key={operation.id}
                operation={operation}
                onEdit={setSelectedOperation}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Nenhuma operação encontrada</p>
            <p className="text-sm">
              {search ? "Tente alterar os filtros de busca" : "Registre suas primeiras operações"}
            </p>
          </div>
        )}
      </div>

      {/* Operation Details Dialog */}
      <Dialog open={!!selectedOperation} onOpenChange={() => setSelectedOperation(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Detalhes da Operação</DialogTitle>
            <DialogDescription>
              Informações completas sobre esta operação
            </DialogDescription>
          </DialogHeader>
          {selectedOperation && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <p className="font-medium capitalize">{selectedOperation.tipo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor</p>
                  <p className="font-medium">{formatCurrency(selectedOperation.valor)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Descrição</p>
                  <p className="font-medium">{selectedOperation.descricao}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Banco</p>
                  <p className="font-medium">{selectedOperation.banco}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-medium">{formatFullDate(selectedOperation.data)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hora</p>
                  <p className="font-medium">{selectedOperation.hora}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedOperation(null)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A operação será permanentemente removida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
