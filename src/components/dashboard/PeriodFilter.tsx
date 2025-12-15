import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

export type PeriodFilterType = "month" | "7days" | "15days" | "custom";

export interface PeriodFilterValue {
  type: PeriodFilterType;
  startDate: Date;
  endDate: Date;
}

interface PeriodFilterProps {
  value: PeriodFilterValue;
  onChange: (value: PeriodFilterValue) => void;
}

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customStart, setCustomStart] = useState<Date | undefined>(value.startDate);
  const [customEnd, setCustomEnd] = useState<Date | undefined>(value.endDate);

  const today = new Date();

  const handlePresetClick = (type: PeriodFilterType) => {
    let startDate: Date;
    let endDate: Date = today;

    switch (type) {
      case "7days":
        startDate = subDays(today, 7);
        break;
      case "15days":
        startDate = subDays(today, 15);
        break;
      case "month":
      default:
        startDate = startOfMonth(today);
        endDate = endOfMonth(today);
        break;
    }

    onChange({ type, startDate, endDate });
  };

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      onChange({
        type: "custom",
        startDate: customStart,
        endDate: customEnd,
      });
      setIsCustomOpen(false);
    }
  };

  const getButtonLabel = () => {
    switch (value.type) {
      case "7days":
        return "Últimos 7 dias";
      case "15days":
        return "Últimos 15 dias";
      case "month":
        return "Este mês";
      case "custom":
        return `${format(value.startDate, "dd/MM")} - ${format(value.endDate, "dd/MM")}`;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant={value.type === "month" ? "default" : "outline"}
        size="sm"
        onClick={() => handlePresetClick("month")}
        className="text-xs"
      >
        Este mês
      </Button>
      <Button
        variant={value.type === "7days" ? "default" : "outline"}
        size="sm"
        onClick={() => handlePresetClick("7days")}
        className="text-xs"
      >
        7 dias
      </Button>
      <Button
        variant={value.type === "15days" ? "default" : "outline"}
        size="sm"
        onClick={() => handlePresetClick("15days")}
        className="text-xs"
      >
        15 dias
      </Button>

      <Popover open={isCustomOpen} onOpenChange={setIsCustomOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={value.type === "custom" ? "default" : "outline"}
            size="sm"
            className="text-xs"
          >
            <CalendarIcon className="h-3 w-3 mr-1" />
            {value.type === "custom" ? getButtonLabel() : "Personalizado"}
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Data inicial</p>
              <Calendar
                mode="single"
                selected={customStart}
                onSelect={setCustomStart}
                locale={ptBR}
                disabled={(date) => date > today}
                className={cn("p-3 pointer-events-auto")}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Data final</p>
              <Calendar
                mode="single"
                selected={customEnd}
                onSelect={setCustomEnd}
                locale={ptBR}
                disabled={(date) => date > today || (customStart ? date < customStart : false)}
                className={cn("p-3 pointer-events-auto")}
              />
            </div>
            <Button
              onClick={handleCustomApply}
              disabled={!customStart || !customEnd}
              className="w-full"
              size="sm"
            >
              Aplicar
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function getDefaultPeriodFilter(): PeriodFilterValue {
  const today = new Date();
  return {
    type: "month",
    startDate: startOfMonth(today),
    endDate: endOfMonth(today),
  };
}
