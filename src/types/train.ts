export type Train = {
  id: string;
  name: string;
  sameAs: string;
  operator: string;
};

export type TrainInformation = {
  id: string;
  date: string;
  operator: string;
  railway: string;
  informationText: string;
};

export type TrainFare = {
  id: string;
  sameAs: string;
  operator: string;
  fromStation: string;
  toStation: string;
  ticketFare: number;
};
