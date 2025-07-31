"use server";

import { Operator } from "@/types/operator";
import { Station } from "@/types/station";
import { Train, TrainFare, TrainInformation } from "@/types/train";

export async function callOdptApi(
  endpoint: string,
  query_params?: Record<string, string>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> {
  const params = new URLSearchParams(query_params).toString();
  const url = `https://api.odpt.org/api/v4/${endpoint}?${
    params ? `${params}&` : ""
  }acl:consumerKey=${process.env.ODPT_API_KEY}`;
  const response = await fetch(url, {
    next: { revalidate: 1 },
  });

  if (!response.ok) {
    throw new Error(
      `Error fetching data from ODPT API: ${response.statusText}`
    );
  }

  return response.json();
}

export async function fetchStations(): Promise<Station[]> {
  const stations = await callOdptApi("odpt:Station");

  const stationMap = new Map<string, Station>();
  for (const station of stations) {
    const id = station["@id"];
    const name = station["dc:title"];
    const sameAs = station["owl:sameAs"];
    const operator = station["odpt:operator"];
    const railway = station["odpt:railway"];

    const stationWithRailways = stationMap.get(name);

    if (!stationWithRailways) {
      stationMap.set(name, {
        id,
        name,
        sameAs,
        operator,
        railways: [railway],
      });
      continue;
    }

    stationWithRailways.railways.push(railway);
  }

  return Array.from(stationMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

export async function fetchOperators(): Promise<Operator[]> {
  const operators = await callOdptApi("odpt:Operator");
  return operators.map((operator) => ({
    id: operator["@id"],
    name: operator["dc:title"],
    sameAs: operator["owl:sameAs"],
  }));
}

export async function fetchRailways(): Promise<Train[]> {
  const railways = await callOdptApi("odpt:Railway");
  return railways.map((railway) => ({
    id: railway["@id"],
    name: railway["dc:title"],
    sameAs: railway["owl:sameAs"],
    operator: railway["odpt:operator"],
  }));
}

export async function fetchTrainInformation(
  operatorSameAs: string,
  railwaySameAs: string
): Promise<TrainInformation[]> {
  const info = await callOdptApi("odpt:TrainInformation", {
    "odpt:operator": operatorSameAs,
    "odpt:railway": railwaySameAs,
  });

  return info.map((item) => {
    return {
      id: item["@id"],
      date: item["dc:date"],
      operator: item["odpt:operator"],
      railway: item["odpt:railway"],
      informationText: item["odpt:trainInformationText"].ja,
    };
  });
}

export async function fetchRailwayFare(
  fromStationSameAs: string,
  toStationSameAs: string
): Promise<TrainFare[]> {
  const fare = await callOdptApi("odpt:RailwayFare", {
    "odpt:fromStation": fromStationSameAs,
    "odpt:toStation": toStationSameAs,
  });

  return fare.map((item) => ({
    id: item["@id"],
    sameAs: item["owl:sameAs"],
    operator: item["odpt:operator"],
    fromStation: item["odpt:fromStation"],
    toStation: item["odpt:toStation"],
    ticketFare: item["odpt:ticketFare"],
  }));
}
