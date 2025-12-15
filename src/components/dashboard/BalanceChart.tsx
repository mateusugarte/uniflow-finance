import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
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

  const minValue = Math.min(...data.map((d) => d.saldo));
  const maxValue = Math.max(...data.map((d) => d.saldo));
  const padding = Math.max(Math.abs(minValue), Math.abs(maxValue)) * 0.1;

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(252, 87%, 54%)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(252, 87%, 54%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(252, 87%, 54%)" />
              <stop offset="50%" stopColor="hsl(280, 85%, 55%)" />
              <stop offset="100%" stopColor="hsl(200, 90%, 55%)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="hsl(var(--border))"
            opacity={0.5}
          />
          <XAxis
            dataKey="data"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            tickFormatter={(value) => formatCurrency(value, true)}
            domain={[minValue - padding, maxValue + padding]}
            width={80}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-card border border-border rounded-lg shadow-lg p-3">
                    <p className="text-sm text-muted-foreground">Dia {label}</p>
                    <p className="text-lg font-bold text-foreground">
                      {formatCurrency(payload[0].value as number)}
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
            stroke="url(#lineGradient)"
            strokeWidth={3}
            fill="url(#colorSaldo)"
            filter="url(#glow)"
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
