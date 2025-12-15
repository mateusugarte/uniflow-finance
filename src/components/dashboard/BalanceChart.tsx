import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DailyBalance } from "@/types/finance";
import { formatCurrency } from "@/lib/format";

interface BalanceChartProps {
  data: DailyBalance[];
  className?: string;
}

export function BalanceChart({ data, className }: BalanceChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      saldoPositivo: item.saldo >= 0 ? item.saldo : 0,
      saldoNegativo: item.saldo < 0 ? item.saldo : 0,
    }));
  }, [data]);

  const minValue = Math.min(...data.map((d) => d.saldo), 0);
  const maxValue = Math.max(...data.map((d) => d.saldo), 0);
  const padding = Math.max(Math.abs(minValue), Math.abs(maxValue)) * 0.15;

  if (data.length === 0) {
    return (
      <div className={className}>
        <div className="h-[280px] flex items-center justify-center text-muted-foreground">
          Nenhum dado disponível para o período selecionado
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(220, 70%, 45%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(220, 70%, 45%)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="hsl(var(--border))"
            opacity={0.6}
          />
          <XAxis
            dataKey="data"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            tickMargin={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            tickFormatter={(value) => formatCurrency(value, true)}
            domain={[minValue - padding, maxValue + padding]}
            width={70}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const value = payload[0].value as number;
                return (
                  <div className="bg-card border border-border rounded-lg shadow-md p-3">
                    <p className="text-xs text-muted-foreground mb-1">Dia {label}</p>
                    <p className={`text-base font-semibold ${value >= 0 ? 'text-income' : 'text-expense'}`}>
                      {formatCurrency(value)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="saldo"
            stroke="hsl(220, 70%, 45%)"
            strokeWidth={2}
            fill="url(#colorBalance)"
            animationDuration={800}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
