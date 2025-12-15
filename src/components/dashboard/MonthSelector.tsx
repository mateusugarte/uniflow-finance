import { format, subMonths, addMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MonthSelectorProps {
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
}

export function MonthSelector({ selectedMonth, onMonthChange }: MonthSelectorProps) {
  const currentYear = selectedMonth.getFullYear();
  const currentMonth = selectedMonth.getMonth();

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i.toString(),
    label: format(new Date(2024, i), "MMMM", { locale: ptBR }),
  }));

  const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - 2 + i;
    return { value: year.toString(), label: year.toString() };
  });

  const handlePrevMonth = () => {
    onMonthChange(subMonths(selectedMonth, 1));
  };

  const handleNextMonth = () => {
    const next = addMonths(selectedMonth, 1);
    if (next <= new Date()) {
      onMonthChange(next);
    }
  };

  const handleMonthSelect = (month: string) => {
    onMonthChange(new Date(currentYear, parseInt(month)));
  };

  const handleYearSelect = (year: string) => {
    onMonthChange(new Date(parseInt(year), currentMonth));
  };

  const isCurrentMonth =
    selectedMonth.getMonth() === new Date().getMonth() &&
    selectedMonth.getFullYear() === new Date().getFullYear();

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={handlePrevMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <Select value={currentMonth.toString()} onValueChange={handleMonthSelect}>
          <SelectTrigger className="w-[120px] border-0 bg-transparent p-0 h-auto font-medium focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value} className="capitalize">
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={currentYear.toString()} onValueChange={handleYearSelect}>
          <SelectTrigger className="w-[80px] border-0 bg-transparent p-0 h-auto font-medium focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {years.map((year) => (
              <SelectItem key={year.value} value={year.value}>
                {year.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={handleNextMonth}
        disabled={isCurrentMonth}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
