"use client";

import { Operator } from "@/types/operator";
import { Station } from "@/types/station";
import { Train } from "@/types/train";
import { useState } from "react";
import { StationCombobox } from "./station-combobox";
import { TrainCombobox } from "./train-combobox";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface TrainSearchProps {
  stations: Station[];
  operators: Operator[];
  railways: Train[];
}

interface SearchedCombination {
  departureStation: Station;
  arrivalStation: Station;
  train: Train;
  delay: number;
  searchedAt?: Date;
}

export function TrainSearch({
  stations,
  operators,
  railways,
}: TrainSearchProps) {
  const [departureStation, setDepartureStation] = useState<Station | undefined>(
    undefined
  );
  const [arrivalStation, setArrivalStation] = useState<Station | undefined>(
    undefined
  );
  const [train, setTrain] = useState<Train | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedCombination, setSearchedCombination] =
    useState<SearchedCombination | null>(null);

  const canSearch = !!departureStation && !!arrivalStation && !!train;

  const handleSearch = () => {
    if (!canSearch) return;
    setIsLoading(true);

    setSearchedCombination({
      departureStation,
      arrivalStation,
      train,
      delay: Math.floor(Math.random() * 60), // Simulate a random delay for demonstration
      searchedAt: new Date(),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6 flex flex-col gap-4 w-full">
        <CardHeader>
          <CardTitle className="text-2xl">遅延検索</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            {/* 出発駅 */}
            <div className="w-full max-w-md">
              <label className="text-sm font-medium mb-2 block text-center">
                出発駅
              </label>
              <StationCombobox
                stations={stations}
                operators={operators}
                stationId={departureStation?.id}
                onChange={setDepartureStation}
                placeholder="出発駅を選択"
                filterByRailwaySameAs={
                  train
                    ? railways.find((railway) => railway.id === train?.id)
                        ?.sameAs
                    : undefined
                }
              />
            </div>

            <div className="flex items-center w-full">
              <div className="flex flex-col items-center mx-auto">
                <div className="w-1 h-8 bg-gray-300"></div>
                <TrainCombobox
                  trains={railways}
                  operators={operators}
                  fromStationOperatorSameAs={departureStation?.operator}
                  toStationOperatorSameAs={arrivalStation?.operator}
                  trainId={train?.id}
                  onChange={setTrain}
                  placeholder="利用路線を選択"
                />
                <div className="w-1 h-8 bg-gray-300"></div>
              </div>
            </div>

            {/* 到着駅 */}
            <div className="w-full max-w-md">
              <label className="text-sm font-medium mb-2 block text-center">
                到着駅
              </label>
              <StationCombobox
                stations={stations}
                operators={operators}
                stationId={arrivalStation?.id}
                onChange={setArrivalStation}
                placeholder="到着駅を選択"
                filterByRailwaySameAs={
                  train
                    ? railways.find((railway) => railway.id === train?.id)
                        ?.sameAs
                    : undefined
                }
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleSearch}
              disabled={!canSearch || isLoading}
              className="w-full max-w-1/2"
              size="lg"
            >
              {isLoading ? "検索中..." : "遅延を検索"}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-xl">検索結果</CardTitle>
        </CardHeader>
        <CardContent>
          {searchedCombination ? (
            <div className="flex justify-center">
              <div>
                <p>
                  {"　"}
                  出発駅 : {searchedCombination.departureStation?.name} (
                  {operators.find(
                    (op) =>
                      op.sameAs ===
                      searchedCombination.departureStation?.operator
                  )?.name || "不明"}
                  )
                </p>
                <p>
                  利用路線 : {searchedCombination.train?.name} (
                  {operators.find(
                    (op) => op.sameAs === searchedCombination.train?.operator
                  )?.name || "不明"}
                  )
                </p>
                <p>
                  {"　"}
                  到着駅 : {searchedCombination.arrivalStation?.name} (
                  {operators.find(
                    (op) =>
                      op.sameAs === searchedCombination.arrivalStation?.operator
                  )?.name || "不明"}
                  )
                </p>
                <p>遅延時間 : {searchedCombination.delay} 分</p>
                <p>
                  検索時刻 : {searchedCombination.searchedAt?.toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-center">条件を入力し、検索を行ってください</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
