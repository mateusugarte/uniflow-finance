import { useFinance } from "@/contexts/FinanceContext";
import { StatCard } from "@/components/dashboard/StatCard";
import { BalanceChart } from "@/components/dashboard/BalanceChart";
import { OperationsList } from "@/components/dashboard/OperationsList";
import { MonthSelector } from "@/components/dashboard/MonthSelector";
import { formatCurrency, formatPercent } from "@/lib/format";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target, 
  PiggyBank,
  BarChart3
} from "lucide-react";

export default function Dashboard() {
  const {
    selectedMonth,
    setSelectedMonth,
    getMonthlyStats,
    getOperationsByMonth,
    getDailyBalances,
    deleteOperation,
  } = useFinance();

  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth();

  const stats = getMonthlyStats(year, month);
  const operations = getOperationsByMonth(year, month);
  const dailyBalances = getDailyBalances(year, month);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe suas finanças em tempo real
          </p>
        </div>
        <MonthSelector
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total de Entradas"
          value={formatCurrency(stats.totalEntradas)}
          subtitle={stats.maiorEntrada ? `Maior: ${stats.maiorEntrada.descricao}` : undefined}
          icon={TrendingUp}
          variant="income"
          delay={0}
        />
        <StatCard
          title="Total de Saídas"
          value={formatCurrency(stats.totalSaidas)}
          subtitle={stats.maiorSaida ? `Maior: ${stats.maiorSaida.descricao}` : undefined}
          icon={TrendingDown}
          variant="expense"
          delay={100}
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
      <div className="bg-card border border-border rounded-2xl p-6 shadow-md animate-slide-up" style={{ animationDelay: "300ms" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-accent">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Evolução do Saldo</h2>
            <p className="text-sm text-muted-foreground">Acompanhe o saldo acumulado dia a dia</p>
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
          subtitle="neste mês"
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
      <div className="bg-card border border-border rounded-2xl p-6 shadow-md animate-slide-up" style={{ animationDelay: "600ms" }}>
        <h2 className="text-lg font-semibold text-foreground mb-4">Operações do Mês</h2>
        <OperationsList
          operations={operations}
          onDelete={deleteOperation}
        />
      </div>
    </div>
  );
}
