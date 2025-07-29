"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Operator } from "@/types/operator";
import { Train } from "@/types/train";
import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";

interface TrainComboboxProps {
  trains: Train[];
  operators: Operator[];
  fromStationOperatorSameAs?: string;
  toStationOperatorSameAs?: string;
  trainId?: string;
  onChange: (value: Train | undefined) => void;
  placeholder: string;
  disabled?: boolean;
}

export function TrainCombobox({
  trains,
  operators,
  fromStationOperatorSameAs,
  toStationOperatorSameAs,
  trainId,
  onChange,
  placeholder,
  disabled = false,
}: TrainComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedTrain = trainId
    ? trains.find((train) => train.id === trainId)
    : undefined;

  // 利用可能な路線を計算
  const availableTrains = useMemo(() => {
    // 両方の駅が選択されている場合は、両方を通る路線のみ
    if (fromStationOperatorSameAs && toStationOperatorSameAs) {
      return trains.filter(
        (train) =>
          train.operator === fromStationOperatorSameAs &&
          train.operator === toStationOperatorSameAs
      );
    }

    // どちらかの駅のみ選択されている場合は、その駅を通る路線
    if (fromStationOperatorSameAs) {
      return trains.filter(
        (train) => train.operator === fromStationOperatorSameAs
      );
    }

    if (toStationOperatorSameAs) {
      return trains.filter(
        (train) => train.operator === toStationOperatorSameAs
      );
    }

    // 駅が選択されていない場合は全ての路線
    return trains;
  }, [fromStationOperatorSameAs, toStationOperatorSameAs, trains]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-white shadow-sm border-2"
          disabled={disabled}
        >
          {selectedTrain ? (
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                // style={{ backgroundColor: selectedTrain.color }}
              ></div>
              <span className="text-sm">{selectedTrain.name}</span>
              <Badge variant="secondary" className="text-xs">
                {operators.find((op) => op.sameAs === selectedTrain.operator)
                  ?.name || "不明"}
              </Badge>
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="路線名を検索..." />
          <CommandList>
            <CommandEmpty>該当する路線が見つかりません。</CommandEmpty>
            <CommandGroup>
              {availableTrains.map((train) => (
                <CommandItem
                  key={train.id}
                  value={train.name}
                  onSelect={() => {
                    onChange(train);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      trainId === train.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      // style={{ backgroundColor: line.color }}
                    ></div>
                    <span>{train.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {operators.find((op) => op.sameAs === train.operator)
                        ?.name || "不明"}
                    </Badge>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
