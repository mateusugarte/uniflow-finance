export type OperationType = "entrada" | "saida";

export interface Operation {
  id: string;
  user_id: string;
  tipo: OperationType;
  valor: number;
  descricao: string;
  banco: string;
  data: string;
  hora: string;
  created_at: string;
  updated_at: string;
}

export interface OperationFormData {
  tipo: OperationType;
  valor: number;
  descricao: string;
  banco: string;
  data: string;
  hora: string;
}

export interface MonthlyStats {
  totalEntradas: number;
  totalSaidas: number;
  saldoLiquido: number;
  maiorEntrada: Operation | null;
  maiorSaida: Operation | null;
  mediaGastoDiario: number;
  taxaEconomia: number;
  totalOperacoes: number;
}

export interface DailyBalance {
  data: string;
  saldo: number;
}

export const BANCOS = [
  "Banco do Brasil",
  "Itaú",
  "Nubank",
  "Caixa",
  "Bradesco",
  "C6 Bank",
  "Inter",
  "Santander",
  "Original",
  "PicPay",
  "Outro",
] as const;

export type Banco = typeof BANCOS[number];
