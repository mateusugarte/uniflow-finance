import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Operation, OperationFormData, MonthlyStats, DailyBalance } from "@/types/finance";
import { format, getDaysInMonth, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { toast } from "sonner";

// Generate unique IDs
const generateId = () => crypto.randomUUID();

// Mock user for demo (will be replaced with Supabase auth)
const MOCK_USER_ID = "demo-user";

interface FinanceContextType {
  operations: Operation[];
  isLoading: boolean;
  addOperation: (data: OperationFormData) => Promise<void>;
  updateOperation: (id: string, data: Partial<OperationFormData>) => Promise<void>;
  deleteOperation: (id: string) => Promise<void>;
  getMonthlyStats: (year: number, month: number) => MonthlyStats;
  getOperationsByMonth: (year: number, month: number) => Operation[];
  getDailyBalances: (year: number, month: number) => DailyBalance[];
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
}

const FinanceContext = createContext<FinanceContextType | null>(null);

// Initial demo data
const createInitialData = (): Operation[] => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  return [
    {
      id: generateId(),
      user_id: MOCK_USER_ID,
      tipo: "entrada",
      valor: 5500,
      descricao: "Salário",
      banco: "Nubank",
      data: format(new Date(currentYear, currentMonth, 5), "yyyy-MM-dd"),
      hora: "09:00",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: generateId(),
      user_id: MOCK_USER_ID,
      tipo: "saida",
      valor: 1200,
      descricao: "Aluguel",
      banco: "Itaú",
      data: format(new Date(currentYear, currentMonth, 10), "yyyy-MM-dd"),
      hora: "10:30",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: generateId(),
      user_id: MOCK_USER_ID,
      tipo: "saida",
      valor: 450,
      descricao: "Supermercado",
      banco: "Nubank",
      data: format(new Date(currentYear, currentMonth, 12), "yyyy-MM-dd"),
      hora: "15:20",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: generateId(),
      user_id: MOCK_USER_ID,
      tipo: "entrada",
      valor: 800,
      descricao: "Freelance",
      banco: "Inter",
      data: format(new Date(currentYear, currentMonth, 15), "yyyy-MM-dd"),
      hora: "14:00",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: generateId(),
      user_id: MOCK_USER_ID,
      tipo: "saida",
      valor: 89.90,
      descricao: "Netflix + Spotify",
      banco: "Nubank",
      data: format(new Date(currentYear, currentMonth, 8), "yyyy-MM-dd"),
      hora: "00:00",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: generateId(),
      user_id: MOCK_USER_ID,
      tipo: "saida",
      valor: 250,
      descricao: "Restaurante",
      banco: "C6 Bank",
      data: format(new Date(currentYear, currentMonth, 18), "yyyy-MM-dd"),
      hora: "20:45",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
};

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [operations, setOperations] = useState<Operation[]>(createInitialData);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const addOperation = useCallback(async (data: OperationFormData) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newOperation: Operation = {
      id: generateId(),
      user_id: MOCK_USER_ID,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setOperations((prev) => [newOperation, ...prev]);
    toast.success(
      data.tipo === "entrada" 
        ? "Entrada registrada com sucesso!" 
        : "Saída registrada com sucesso!"
    );
    setIsLoading(false);
  }, []);

  const updateOperation = useCallback(async (id: string, data: Partial<OperationFormData>) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    setOperations((prev) =>
      prev.map((op) =>
        op.id === id
          ? { ...op, ...data, updated_at: new Date().toISOString() }
          : op
      )
    );
    toast.success("Operação atualizada!");
    setIsLoading(false);
  }, []);

  const deleteOperation = useCallback(async (id: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    setOperations((prev) => prev.filter((op) => op.id !== id));
    toast.success("Operação removida!");
    setIsLoading(false);
  }, []);

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
    
    const totalEntradas = entradas.reduce((sum, op) => sum + op.valor, 0);
    const totalSaidas = saidas.reduce((sum, op) => sum + op.valor, 0);
    const saldoLiquido = totalEntradas - totalSaidas;
    
    const maiorEntrada = entradas.length > 0
      ? entradas.reduce((max, op) => op.valor > max.valor ? op : max)
      : null;
    
    const maiorSaida = saidas.length > 0
      ? saidas.reduce((max, op) => op.valor > max.valor ? op : max)
      : null;
    
    const daysInMonth = getDaysInMonth(new Date(year, month));
    const mediaGastoDiario = totalSaidas / daysInMonth;
    
    const taxaEconomia = totalEntradas > 0
      ? ((totalEntradas - totalSaidas) / totalEntradas) * 100
      : 0;

    return {
      totalEntradas,
      totalSaidas,
      saldoLiquido,
      maiorEntrada,
      maiorSaida,
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
        selectedMonth,
        setSelectedMonth,
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
