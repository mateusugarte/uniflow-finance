import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Operation, OperationFormData, MonthlyStats, DailyBalance } from "@/types/finance";
import { format, getDaysInMonth, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, differenceInDays } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { useUserSwitch } from "./UserSwitchContext";

interface FinanceContextType {
  operations: Operation[];
  isLoading: boolean;
  addOperation: (data: OperationFormData) => Promise<void>;
  updateOperation: (id: string, data: Partial<OperationFormData>) => Promise<void>;
  deleteOperation: (id: string) => Promise<void>;
  getMonthlyStats: (year: number, month: number) => MonthlyStats;
  getOperationsByMonth: (year: number, month: number) => Operation[];
  getDailyBalances: (year: number, month: number) => DailyBalance[];
  getOperationsByPeriod: (startDate: Date, endDate: Date) => Operation[];
  getStatsByPeriod: (startDate: Date, endDate: Date) => MonthlyStats;
  getDailyBalancesByPeriod: (startDate: Date, endDate: Date) => DailyBalance[];
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
  refreshOperations: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { selectedUserId } = useUserSwitch();
  const [operations, setOperations] = useState<Operation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const fetchOperations = useCallback(async () => {
    if (!user || !selectedUserId) {
      setOperations([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("operacoes")
        .select("*")
        .eq("user_id", selectedUserId)
        .order("data", { ascending: false })
        .order("hora", { ascending: false });

      if (error) throw error;

      const formattedData: Operation[] = (data || []).map((op) => ({
        id: op.id,
        user_id: op.user_id,
        tipo: op.tipo as "entrada" | "saida" | "venda",
        valor: Number(op.valor),
        descricao: op.descricao,
        banco: op.banco,
        data: op.data,
        hora: op.hora,
        created_at: op.created_at,
        updated_at: op.updated_at,
      }));

      setOperations(formattedData);
    } catch (error) {
      console.error("Error fetching operations:", error);
      toast.error("Erro ao carregar operações");
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedUserId]);

  useEffect(() => {
    fetchOperations();
  }, [fetchOperations]);

  const addOperation = useCallback(async (data: OperationFormData) => {
    if (!user || !selectedUserId) {
      toast.error("Você precisa estar logado");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from("operacoes").insert({
        user_id: selectedUserId,
        tipo: data.tipo,
        valor: data.valor,
        descricao: data.descricao,
        banco: data.banco,
        data: data.data,
        hora: data.hora,
      });

      if (error) throw error;

      await fetchOperations();
      
      const messages = {
        entrada: "Entrada registrada com sucesso!",
        saida: "Saída registrada com sucesso!",
        venda: "Venda registrada com sucesso!"
      };
      toast.success(messages[data.tipo]);
    } catch (error) {
      console.error("Error adding operation:", error);
      toast.error("Erro ao registrar operação");
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedUserId, fetchOperations]);

  const updateOperation = useCallback(async (id: string, data: Partial<OperationFormData>) => {
    if (!user || !selectedUserId) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("operacoes")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", selectedUserId);

      if (error) throw error;

      await fetchOperations();
      toast.success("Operação atualizada!");
    } catch (error) {
      console.error("Error updating operation:", error);
      toast.error("Erro ao atualizar operação");
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedUserId, fetchOperations]);

  const deleteOperation = useCallback(async (id: string) => {
    if (!user || !selectedUserId) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("operacoes")
        .delete()
        .eq("id", id)
        .eq("user_id", selectedUserId);

      if (error) throw error;

      await fetchOperations();
      toast.success("Operação removida!");
    } catch (error) {
      console.error("Error deleting operation:", error);
      toast.error("Erro ao remover operação");
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedUserId, fetchOperations]);

  const getOperationsByMonth = useCallback((year: number, month: number): Operation[] => {
    return operations
      .filter((op) => {
        const opDate = parseISO(op.data);
        return opDate.getFullYear() === year && opDate.getMonth() === month;
      })
      .sort((a, b) => {
        const dateCompare = b.data.localeCompare(a.data);
        if (dateCompare !== 0) return dateCompare;
        return b.hora.localeCompare(a.hora);
      });
  }, [operations]);

  const getMonthlyStats = useCallback((year: number, month: number): MonthlyStats => {
    const monthOps = getOperationsByMonth(year, month);

    const entradas = monthOps.filter((op) => op.tipo === "entrada");
    const saidas = monthOps.filter((op) => op.tipo === "saida");
    const vendas = monthOps.filter((op) => op.tipo === "venda");

    const totalEntradas = entradas.reduce((sum, op) => sum + op.valor, 0);
    const totalSaidas = saidas.reduce((sum, op) => sum + op.valor, 0);
    const totalVendas = vendas.reduce((sum, op) => sum + op.valor, 0);
    
    // Saldo líquido: entradas - saídas - vendas
    const saldoLiquido = totalEntradas - totalSaidas - totalVendas;
    // Saldo sem venda: entradas - saídas
    const saldoSemVenda = totalEntradas - totalSaidas;

    const maiorEntrada = entradas.length > 0
      ? entradas.reduce((max, op) => op.valor > max.valor ? op : max)
      : null;

    const maiorSaida = saidas.length > 0
      ? saidas.reduce((max, op) => op.valor > max.valor ? op : max)
      : null;

    const maiorVenda = vendas.length > 0
      ? vendas.reduce((max, op) => op.valor > max.valor ? op : max)
      : null;

    const daysInMonth = getDaysInMonth(new Date(year, month));
    const mediaGastoDiario = totalSaidas / daysInMonth;

    const taxaEconomia = totalEntradas > 0
      ? ((totalEntradas - totalSaidas) / totalEntradas) * 100
      : 0;

    return {
      totalEntradas,
      totalSaidas,
      totalVendas,
      saldoLiquido,
      saldoSemVenda,
      maiorEntrada,
      maiorSaida,
      maiorVenda,
      mediaGastoDiario,
      taxaEconomia,
      totalOperacoes: monthOps.length,
    };
  }, [getOperationsByMonth]);

  const getDailyBalances = useCallback((year: number, month: number): DailyBalance[] => {
    const monthOps = getOperationsByMonth(year, month);
    const start = startOfMonth(new Date(year, month));
    const end = endOfMonth(new Date(year, month));
    const days = eachDayOfInterval({ start, end });

    let runningBalance = 0;

    return days.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayOps = monthOps.filter((op) => op.data === dayStr);

      dayOps.forEach((op) => {
        if (op.tipo === "entrada") {
          runningBalance += op.valor;
        } else {
          runningBalance -= op.valor;
        }
      });

      return {
        data: format(day, "dd"),
        saldo: runningBalance,
      };
    });
  }, [getOperationsByMonth]);

  const getOperationsByPeriod = useCallback((startDate: Date, endDate: Date): Operation[] => {
    const startStr = format(startDate, "yyyy-MM-dd");
    const endStr = format(endDate, "yyyy-MM-dd");
    
    return operations
      .filter((op) => op.data >= startStr && op.data <= endStr)
      .sort((a, b) => {
        const dateCompare = b.data.localeCompare(a.data);
        if (dateCompare !== 0) return dateCompare;
        return b.hora.localeCompare(a.hora);
      });
  }, [operations]);

  const getStatsByPeriod = useCallback((startDate: Date, endDate: Date): MonthlyStats => {
    const periodOps = getOperationsByPeriod(startDate, endDate);

    const entradas = periodOps.filter((op) => op.tipo === "entrada");
    const saidas = periodOps.filter((op) => op.tipo === "saida");
    const vendas = periodOps.filter((op) => op.tipo === "venda");

    const totalEntradas = entradas.reduce((sum, op) => sum + op.valor, 0);
    const totalSaidas = saidas.reduce((sum, op) => sum + op.valor, 0);
    const totalVendas = vendas.reduce((sum, op) => sum + op.valor, 0);
    
    // Saldo líquido com venda: entradas - saídas - vendas
    const saldoLiquido = totalEntradas - totalSaidas - totalVendas;
    // Saldo sem venda: entradas - saídas
    const saldoSemVenda = totalEntradas - totalSaidas;

    const maiorEntrada = entradas.length > 0
      ? entradas.reduce((max, op) => op.valor > max.valor ? op : max)
      : null;

    const maiorSaida = saidas.length > 0
      ? saidas.reduce((max, op) => op.valor > max.valor ? op : max)
      : null;

    const maiorVenda = vendas.length > 0
      ? vendas.reduce((max, op) => op.valor > max.valor ? op : max)
      : null;

    const daysInPeriod = differenceInDays(endDate, startDate) + 1;
    const mediaGastoDiario = totalSaidas / daysInPeriod;

    const taxaEconomia = totalEntradas > 0
      ? ((totalEntradas - totalSaidas) / totalEntradas) * 100
      : 0;

    return {
      totalEntradas,
      totalSaidas,
      totalVendas,
      saldoLiquido,
      saldoSemVenda,
      maiorEntrada,
      maiorSaida,
      maiorVenda,
      mediaGastoDiario,
      taxaEconomia,
      totalOperacoes: periodOps.length,
    };
  }, [getOperationsByPeriod]);

  const getDailyBalancesByPeriod = useCallback((startDate: Date, endDate: Date): DailyBalance[] => {
    const periodOps = getOperationsByPeriod(startDate, endDate);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    let runningBalance = 0;

    return days.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayOps = periodOps.filter((op) => op.data === dayStr);

      dayOps.forEach((op) => {
        if (op.tipo === "entrada") {
          runningBalance += op.valor;
        } else {
          runningBalance -= op.valor;
        }
      });

      return {
        data: format(day, "dd"),
        saldo: runningBalance,
      };
    });
  }, [getOperationsByPeriod]);

  return (
    <FinanceContext.Provider
      value={{
        operations,
        isLoading,
        addOperation,
        updateOperation,
        deleteOperation,
        getMonthlyStats,
        getOperationsByMonth,
        getDailyBalances,
        getOperationsByPeriod,
        getStatsByPeriod,
        getDailyBalancesByPeriod,
        selectedMonth,
        setSelectedMonth,
        refreshOperations: fetchOperations,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
}
