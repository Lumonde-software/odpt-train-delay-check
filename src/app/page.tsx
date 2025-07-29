import { TrainSearch } from "@/components/train-search";
import { fetchOperators, fetchRailways, fetchStations } from "./api";

export default async function Page() {
  const stations = await fetchStations();
  const operators = await fetchOperators();
  const railways = await fetchRailways();

  return (
    <div className="flex justify-center">
      <div className="flex flex-col min-h-screen p-4 gap-6 w-2/3">
        <div className="text-2xl font-bold w-full">ODPT Train Delay Check</div>
        <TrainSearch
          stations={stations}
          operators={operators}
          railways={railways}
        />
      </div>
    </div>
  );
}
