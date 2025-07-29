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
import { Station } from "@/types/station";
import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";

interface StationComboboxProps {
  stations: Station[];
  operators: Operator[];
  stationId?: string;
  onChange: (value: Station | undefined) => void;
  placeholder: string;
  disabled?: boolean;
  filterByRailwaySameAs?: string;
}

export function StationCombobox({
  stations,
  operators,
  stationId,
  onChange,
  placeholder,
  disabled = false,
  filterByRailwaySameAs,
}: StationComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedStation = stationId
    ? stations.find((station) => station.id === stationId)
    : undefined;

  // 路線でフィルタリングされた駅リスト
  const filteredStations = useMemo(() => {
    if (!filterByRailwaySameAs) return stations;

    return stations.filter(
      (station) => station.railway === filterByRailwaySameAs
    );
  }, [filterByRailwaySameAs, stations]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
          disabled={disabled}
        >
          {selectedStation ? (
            <div className="flex items-center gap-2">
              <span>{selectedStation.name}</span>
              <Badge variant="secondary" className="text-xs">
                {operators.find((op) => op.sameAs === selectedStation.operator)
                  ?.name || "不明"}
              </Badge>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="駅名を検索..." />
          <CommandList>
            <CommandEmpty>該当する駅が見つかりません。</CommandEmpty>
            <CommandGroup>
              {filteredStations.map((station) => (
                <CommandItem
                  key={station.id}
                  value={station.name}
                  onSelect={() => {
                    onChange(station);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      stationId === station.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <span>{station.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {operators.find((op) => op.sameAs === station.operator)
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
