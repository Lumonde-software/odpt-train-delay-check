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
  fromStationRailways?: string[];
  toStationRailways?: string[];
  trainId?: string;
  onChange: (value: Train | undefined) => void;
  placeholder: string;
  disabled?: boolean;
}

export function TrainCombobox({
  trains,
  operators,
  fromStationRailways,
  toStationRailways,
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
    if (fromStationRailways && toStationRailways) {
      return trains.filter(
        (train) =>
          fromStationRailways.includes(train.sameAs) &&
          toStationRailways.includes(train.sameAs)
      );
    }

    // どちらかの駅のみ選択されている場合は、その駅を通る路線
    if (fromStationRailways) {
      return trains.filter((train) =>
        fromStationRailways.includes(train.sameAs)
      );
    }

    if (toStationRailways) {
      return trains.filter((train) => toStationRailways.includes(train.sameAs));
    }

    // 駅が選択されていない場合は全ての路線
    return trains;
  }, [fromStationRailways, toStationRailways, trains]);

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
                    if (train.id === trainId) {
                      onChange(undefined);
                    } else {
                      onChange(train);
                    }
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
