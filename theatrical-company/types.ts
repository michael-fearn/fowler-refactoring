export type Performance = { playID: string; audience: number };

export type EnrichedPerformance = {
  playID: string;
  audience: number;
  play: Play;
  amount: number;
  volumeCredits: number;
};

export type StatementData = {
  customer: string;
  performances: EnrichedPerformance[];
  totalAmount: number;
  totalVolumeCredits: number;
};

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
