"use server";

import { Operator } from "@/types/operator";
import { Station } from "@/types/station";
import { Train } from "@/types/train";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function callOdptApi(endpoint: string): Promise<any[]> {
  const response = await fetch(
    `https://api.odpt.org/api/v4/${endpoint}?acl:consumerKey=${process.env.ODPT_API_KEY}`,
    {
      next: { revalidate: 1 },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Error fetching data from ODPT API: ${response.statusText}`
    );
  }

  return response.json();
}

export async function fetchStations(): Promise<Station[]> {
  const stations = await callOdptApi("odpt:Station");
  return stations.map((station) => ({
    id: station["@id"],
    name: station["dc:title"],
    sameAs: station["owl:sameAs"],
    operator: station["odpt:operator"],
    railway: station["odpt:railway"],
  }));
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
