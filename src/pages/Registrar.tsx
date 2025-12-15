import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFinance } from "@/contexts/FinanceContext";
import { OperationType, BANCOS } from "@/types/finance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpCircle, ArrowDownCircle, ArrowLeft, Loader2, Check, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function Registrar() {
  const navigate = useNavigate();
  const { addOperation, isLoading } = useFinance();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [tipo, setTipo] = useState<OperationType | null>(null);
  const [formData, setFormData] = useState({
    valor: "",
    descricao: "",
    banco: "",
    data: format(new Date(), "yyyy-MM-dd"),
    hora: format(new Date(), "HH:mm"),
    isVenda: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSelectType = (type: OperationType) => {
    setTipo(type);
    setStep(2);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      newErrors.valor = "Valor deve ser maior que zero";
    }
    if (!formData.descricao.trim()) {
      newErrors.descricao = "Descrição é obrigatória";
    }
    if (formData.descricao.length > 100) {
      newErrors.descricao = "Máximo de 100 caracteres";
    }
    if (!formData.banco) {
      newErrors.banco = "Selecione um banco";
    }
    if (!formData.data) {
      newErrors.data = "Data é obrigatória";
    }
    if (new Date(formData.data) > new Date()) {
      newErrors.data = "Data não pode ser futura";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tipo || !validate()) return;

    await addOperation({
      tipo,
      valor: parseFloat(formData.valor),
      descricao: formData.descricao.trim(),
      banco: formData.banco,
      data: formData.data,
      hora: formData.hora,
      is_venda: tipo === 'saida' ? formData.isVenda : false,
    });

    // Reset form
    setStep(1);
    setTipo(null);
    setFormData({
      valor: "",
      descricao: "",
      banco: "",
      data: format(new Date(), "yyyy-MM-dd"),
      hora: format(new Date(), "HH:mm"),
      isVenda: false,
    });
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setTipo(null);
    } else {
      navigate("/dashboard");
    }
  };

  const formatCurrencyInput = (value: string) => {
    const cleaned = value.replace(/[^\d.]/g, "");
    return cleaned;
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 animate-fade-in">
        <Button variant="ghost" size="icon" onClick={handleBack} className="hover:bg-accent">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Registrar Operação</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {step === 1 ? "Selecione o tipo de operação" : `Registrar ${tipo === "entrada" ? "Entrada" : "Saída"}`}
          </p>
        </div>
      </div>

      {/* Step 1: Select Type */}
      {step === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up">
          <button
            onClick={() => handleSelectType("entrada")}
            className="group relative overflow-hidden rounded-xl p-6 bg-income/15 border border-income/30 text-foreground transition-all duration-300 hover:scale-[1.02] hover:bg-income/25 hover:border-income/50"
          >
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="p-3 rounded-xl bg-income text-income-foreground">
                <ArrowUpCircle className="h-8 w-8" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-income">Entrada</h3>
                <p className="text-sm text-muted-foreground mt-1">Dinheiro que entra</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleSelectType("saida")}
            className="group relative overflow-hidden rounded-xl p-6 bg-expense/15 border border-expense/30 text-foreground transition-all duration-300 hover:scale-[1.02] hover:bg-expense/25 hover:border-expense/50"
          >
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="p-3 rounded-xl bg-expense text-expense-foreground">
                <ArrowDownCircle className="h-8 w-8" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-expense">Saída</h3>
                <p className="text-sm text-muted-foreground mt-1">Dinheiro que sai</p>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Step 2: Form */}
      {step === 2 && tipo && (
        <form onSubmit={handleSubmit} className="space-y-5 animate-slide-up">
          <div
            className={cn(
              "rounded-xl p-4 mb-4 flex items-center gap-3",
              tipo === "entrada" ? "bg-income/20 border border-income/30" : "bg-expense/20 border border-expense/30"
            )}
          >
            {tipo === "entrada" ? (
              <ArrowUpCircle className="h-5 w-5 text-income" />
            ) : (
              <ArrowDownCircle className="h-5 w-5 text-expense" />
            )}
            <span className={cn(
              "font-semibold",
              tipo === "entrada" ? "text-income" : "text-expense"
            )}>
              {tipo === "entrada" ? "Nova Entrada" : "Nova Saída"}
            </span>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 space-y-5">
            {/* Valor */}
            <div className="space-y-2">
              <Label htmlFor="valor" className="text-foreground font-medium">
                Valor (R$) *
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  R$
                </span>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0,00"
                  value={formData.valor}
                  onChange={(e) =>
                    setFormData({ ...formData, valor: formatCurrencyInput(e.target.value) })
                  }
                  className={cn(
                    "pl-12 h-11 text-lg font-semibold",
                    errors.valor && "border-destructive"
                  )}
                />
              </div>
              {errors.valor && (
                <p className="text-sm text-destructive">{errors.valor}</p>
              )}
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="descricao" className="text-foreground font-medium">
                Descrição *
              </Label>
              <Input
                id="descricao"
                placeholder="Ex: Salário, Compras, Aluguel..."
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                maxLength={100}
                className={cn("h-11", errors.descricao && "border-destructive")}
              />
              <div className="flex justify-between">
                {errors.descricao && (
                  <p className="text-sm text-destructive">{errors.descricao}</p>
                )}
                <p className="text-xs text-muted-foreground ml-auto">
                  {formData.descricao.length}/100
                </p>
              </div>
            </div>

            {/* Banco */}
            <div className="space-y-2">
              <Label htmlFor="banco" className="text-foreground font-medium">
                Banco / Conta *
              </Label>
              <Select
                value={formData.banco}
                onValueChange={(value) => setFormData({ ...formData, banco: value })}
              >
                <SelectTrigger
                  className={cn("h-11", errors.banco && "border-destructive")}
                >
                  <SelectValue placeholder="Selecione o banco" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {BANCOS.map((banco) => (
                    <SelectItem key={banco} value={banco}>
                      {banco}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.banco && (
                <p className="text-sm text-destructive">{errors.banco}</p>
              )}
            </div>

            {/* Data e Hora */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data" className="text-foreground font-medium">
                  Data *
                </Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  max={format(new Date(), "yyyy-MM-dd")}
                  onChange={(e) =>
                    setFormData({ ...formData, data: e.target.value })
                  }
                  className={cn("h-11", errors.data && "border-destructive")}
                />
                {errors.data && (
                  <p className="text-sm text-destructive">{errors.data}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="hora" className="text-foreground font-medium">
                  Hora
                </Label>
                <Input
                  id="hora"
                  type="time"
                  value={formData.hora}
                  onChange={(e) =>
                    setFormData({ ...formData, hora: e.target.value })
                  }
                  className="h-11"
                />
              </div>
            </div>

            {/* Checkbox Venda - apenas para saídas */}
            {tipo === 'saida' && (
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
                <Checkbox
                  id="isVenda"
                  checked={formData.isVenda}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isVenda: checked === true })
                  }
                  className="border-orange-500 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                />
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-orange-500" />
                  <Label
                    htmlFor="isVenda"
                    className="text-sm font-medium text-foreground cursor-pointer"
                  >
                    Esta saída é uma venda
                  </Label>
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={handleBack}
            >
              Voltar
            </Button>
            <Button
              type="submit"
              variant={tipo === "entrada" ? "income" : "expense"}
              size="lg"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Registrar {tipo === "entrada" ? "Entrada" : "Saída"}
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
