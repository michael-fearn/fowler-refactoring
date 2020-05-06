import { PerformanceCalculator } from "./create-statement-data";

export type Performance = { playID: string; audience: number };

export type Invoice = {
  customer: string;
  performances: Performance[];
};

export type Play = {
  name: string;
  type: string;
};

export type Plays = {
  [key: string]: Play;
};

export type StatementData = {
  customer: string;
  performances: PerformanceCalculator[];
  totalAmount: number;
  totalVolumeCredits: number;
};
