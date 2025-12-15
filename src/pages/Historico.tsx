import { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { Operation } from "@/types/finance";
import { PeriodFilter, PeriodFilterValue, getDefaultPeriodFilter } from "@/components/dashboard/PeriodFilter";
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
  Wallet,
  ShoppingBag,
  Receipt,
} from "lucide-react";

export default function Historico() {
  const {
    getStatsByPeriod,
    getOperationsByPeriod,
    deleteOperation,
  } = useFinance();

  const [periodFilter, setPeriodFilter] = useState<PeriodFilterValue>(getDefaultPeriodFilter());
  const [search, setSearch] = useState("");
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const stats = getStatsByPeriod(periodFilter.startDate, periodFilter.endDate);
  const allOperations = getOperationsByPeriod(periodFilter.startDate, periodFilter.endDate);

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

  const entradas = allOperations.filter(op => op.tipo === "entrada");
  const saidas = allOperations.filter(op => op.tipo === "saida");
  const vendas = allOperations.filter(op => op.tipo === "venda");

  // Cálculos de ticket médio por tipo
  const ticketMedioEntradas = entradas.length > 0 
    ? stats.totalEntradas / entradas.length 
    : 0;
  const ticketMedioSaidas = saidas.length > 0 
    ? stats.totalSaidas / saidas.length 
    : 0;
  const ticketMedioVendas = vendas.length > 0 
    ? stats.totalVendas / vendas.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Histórico</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Análise detalhada das suas operações
          </p>
        </div>
        <PeriodFilter
          value={periodFilter}
          onChange={setPeriodFilter}
        />
      </div>

      {/* Summary Cards - Entradas, Saídas, Vendas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total de Entradas"
          value={formatCurrency(stats.totalEntradas)}
          subtitle={`${entradas.length} operações`}
          icon={TrendingUp}
          variant="income"
          delay={0}
        />
        <StatCard
          title="Total de Saídas"
          value={formatCurrency(stats.totalSaidas)}
          subtitle={`${saidas.length} operações`}
          icon={TrendingDown}
          variant="expense"
          delay={100}
        />
        <StatCard
          title="Total de Vendas"
          value={formatCurrency(stats.totalVendas)}
          subtitle={`${vendas.length} vendas (empréstimos)`}
          icon={ShoppingBag}
          variant="sales"
          delay={200}
        />
      </div>

      {/* Balance Card */}
      <div className="bg-balance/20 border border-balance/30 rounded-xl p-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-balance text-balance-foreground">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Saldo Líquido</p>
            <p className="text-2xl font-bold text-balance">
              {formatCurrency(stats.saldoLiquido)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Entradas - Saídas - Vendas</p>
          </div>
        </div>
      </div>

      {/* Ticket Médio por Tipo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Ticket Médio Entradas"
          value={formatCurrency(ticketMedioEntradas)}
          subtitle="por entrada"
          icon={TrendingUp}
          delay={400}
        />
        <StatCard
          title="Ticket Médio Saídas"
          value={formatCurrency(ticketMedioSaidas)}
          subtitle="por saída"
          icon={TrendingDown}
          delay={450}
        />
        <StatCard
          title="Ticket Médio Vendas"
          value={formatCurrency(ticketMedioVendas)}
          subtitle="por venda"
          icon={ShoppingBag}
          delay={500}
        />
        <StatCard
          title="Total de Operações"
          value={stats.totalOperacoes.toString()}
          subtitle="no período"
          icon={Activity}
          delay={550}
        />
      </div>

      {/* Taxa de Economia */}
      <div className="bg-card border border-border rounded-xl p-6 animate-slide-up" style={{ animationDelay: "600ms" }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/20 text-primary">
              <Receipt className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Economia</p>
              <p className="text-2xl font-bold text-foreground">
                {formatPercent(stats.taxaEconomia)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Média de Gasto Diário</p>
            <p className="text-xl font-bold text-foreground">
              {formatCurrency(stats.mediaGastoDiario)}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative animate-fade-in" style={{ animationDelay: "650ms" }}>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por descrição ou banco..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11 bg-card"
        />
      </div>

      {/* Operations Table */}
      <div className="bg-card border border-border rounded-xl p-5 animate-slide-up" style={{ animationDelay: "700ms" }}>
        <h2 className="text-base font-semibold text-foreground mb-4">
          Todas as Operações ({filteredOperations.length})
        </h2>
        
        {filteredOperations.length > 0 ? (
          <div className="space-y-2">
            {filteredOperations.map((operation, index) => (
              <div 
                key={operation.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${750 + index * 50}ms` }}
              >
                <OperationItem
                  operation={operation}
                  onEdit={setSelectedOperation}
                  onDelete={(id) => setDeleteId(id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            <BarChart3 className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-base">Nenhuma operação encontrada</p>
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
