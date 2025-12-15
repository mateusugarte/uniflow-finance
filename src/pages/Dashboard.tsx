import { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { StatCard } from "@/components/dashboard/StatCard";
import { BalanceChart } from "@/components/dashboard/BalanceChart";
import { OperationsList } from "@/components/dashboard/OperationsList";
import { PeriodFilter, PeriodFilterValue, getDefaultPeriodFilter } from "@/components/dashboard/PeriodFilter";
import { formatCurrency, formatPercent } from "@/lib/format";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target, 
  PiggyBank,
  BarChart3,
  X,
  ShoppingBag
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OperationItem } from "@/components/dashboard/OperationItem";

export default function Dashboard() {
  const {
    getStatsByPeriod,
    getOperationsByPeriod,
    getDailyBalancesByPeriod,
    deleteOperation,
  } = useFinance();

  const [periodFilter, setPeriodFilter] = useState<PeriodFilterValue>(getDefaultPeriodFilter());
  const [detailsDialog, setDetailsDialog] = useState<{ open: boolean; type: 'entrada' | 'saida' | null }>({ open: false, type: null });

  const stats = getStatsByPeriod(periodFilter.startDate, periodFilter.endDate);
  const operations = getOperationsByPeriod(periodFilter.startDate, periodFilter.endDate);
  const dailyBalances = getDailyBalancesByPeriod(periodFilter.startDate, periodFilter.endDate);

  const entradas = operations.filter(op => op.tipo === 'entrada');
  const saidas = operations.filter(op => op.tipo === 'saida');
  const vendas = operations.filter(op => op.tipo === 'saida' && op.is_venda);
  const totalVendas = vendas.reduce((sum, op) => sum + op.valor, 0);

  const getFilteredOperations = () => {
    if (detailsDialog.type === 'entrada') return entradas;
    if (detailsDialog.type === 'saida') return saidas;
    return [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Acompanhe suas finanças em tempo real
          </p>
        </div>
        <PeriodFilter
          value={periodFilter}
          onChange={setPeriodFilter}
        />
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setDetailsDialog({ open: true, type: 'entrada' })}
          className="cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <StatCard
            title="Total de Entradas"
            value={formatCurrency(stats.totalEntradas)}
            subtitle={`${entradas.length} operações • Clique para ver detalhes`}
            icon={TrendingUp}
            variant="income"
            delay={0}
          />
        </div>
        <div 
          onClick={() => setDetailsDialog({ open: true, type: 'saida' })}
          className="cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <StatCard
            title="Total de Saídas"
            value={formatCurrency(stats.totalSaidas)}
            subtitle={`${saidas.length} operações • Clique para ver detalhes`}
            icon={TrendingDown}
            variant="expense"
            delay={100}
          />
        </div>
        <StatCard
          title="Vendas"
          value={formatCurrency(totalVendas)}
          subtitle={`${vendas.length} vendas no período`}
          icon={ShoppingBag}
          variant="sales"
          delay={150}
        />
        <StatCard
          title="Saldo Líquido"
          value={formatCurrency(stats.saldoLiquido)}
          subtitle={`Taxa de economia: ${formatPercent(stats.taxaEconomia)}`}
          icon={Wallet}
          variant="balance"
          delay={200}
        />
      </div>

      {/* Chart Section */}
      <div className="bg-card border border-border rounded-xl p-5 animate-slide-up" style={{ animationDelay: "300ms" }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-primary/20">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Evolução do Saldo</h2>
            <p className="text-xs text-muted-foreground">Acompanhe o saldo acumulado dia a dia</p>
          </div>
        </div>
        <BalanceChart data={dailyBalances} />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Média de Gasto Diário"
          value={formatCurrency(stats.mediaGastoDiario)}
          icon={Target}
          delay={400}
        />
        <StatCard
          title="Total de Operações"
          value={stats.totalOperacoes.toString()}
          subtitle="no período"
          icon={BarChart3}
          delay={450}
        />
        <StatCard
          title="Maior Entrada"
          value={stats.maiorEntrada ? formatCurrency(stats.maiorEntrada.valor) : "—"}
          subtitle={stats.maiorEntrada?.descricao}
          icon={TrendingUp}
          delay={500}
        />
        <StatCard
          title="Taxa de Economia"
          value={formatPercent(stats.taxaEconomia)}
          subtitle={stats.taxaEconomia >= 0 ? "Você está economizando!" : "Gastos excedem entradas"}
          icon={PiggyBank}
          delay={550}
        />
      </div>

      {/* Operations List */}
      <div className="bg-card border border-border rounded-xl p-5 animate-slide-up" style={{ animationDelay: "600ms" }}>
        <h2 className="text-base font-semibold text-foreground mb-4">Operações do Período</h2>
        <OperationsList
          operations={operations}
          onDelete={deleteOperation}
        />
      </div>

      {/* Details Dialog */}
      <Dialog open={detailsDialog.open} onOpenChange={(open) => setDetailsDialog({ open, type: open ? detailsDialog.type : null })}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {detailsDialog.type === 'entrada' ? (
                <>
                  <TrendingUp className="h-5 w-5 text-finance-income" />
                  Detalhes das Entradas
                </>
              ) : (
                <>
                  <TrendingDown className="h-5 w-5 text-finance-expense" />
                  Detalhes das Saídas
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {getFilteredOperations().length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma operação encontrada no período selecionado.
              </p>
            ) : (
              getFilteredOperations().map((operation) => (
                <OperationItem
                  key={operation.id}
                  operation={operation}
                  onDelete={deleteOperation}
                />
              ))
            )}
          </div>
          <div className="pt-4 border-t border-border mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {getFilteredOperations().length} operações
              </span>
              <span className={`font-semibold ${detailsDialog.type === 'entrada' ? 'text-finance-income' : 'text-finance-expense'}`}>
                Total: {formatCurrency(detailsDialog.type === 'entrada' ? stats.totalEntradas : stats.totalSaidas)}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
