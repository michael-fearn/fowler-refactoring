import { Invoice, Plays, Play, StatementData, Performance } from "./types";

export abstract class PerformanceCalculator {
  public performance: Performance;
  public audience: number;
  public play: Play;

  constructor(performance: Performance, play: Play) {
    this.performance = performance;
    this.audience = performance.audience;
    this.play = play;
  }

  abstract get amount(): number;

  get volumeCredits() {
    return Math.max(this.audience - 30, 0);
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000;
    if (this.audience > 30) {
      result += 1000 * (this.audience - 30);
    }
    return result;
  }
}
class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000;
    if (this.audience > 20) {
      result += 10000 + 500 * (this.audience - 20);
    }
    result += 300 * this.audience;
    return result;
  }
  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.audience / 5);
  }
}

function createPerformanceCalculator(performance: Performance, play: Play) {
  switch (play.type) {
    case "tragedy":
      return new TragedyCalculator(performance, play);
    case "comedy":
      return new ComedyCalculator(performance, play);
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
}

export function createStatementData(
  invoice: Invoice,
  plays: Plays
): StatementData {
  const performances = invoice.performances.map(enrichPerformance);
  return {
    performances,
    customer: invoice.customer,
    totalVolumeCredits: performances.reduce(
      (t, p) => (t += p.volumeCredits),
      0
    ),

    totalAmount: performances.reduce((t, p) => (t += p.amount), 0),
  };

  function enrichPerformance(aPerformance: Performance): PerformanceCalculator {
    return createPerformanceCalculator(aPerformance, playFor(aPerformance));
  }

  function playFor(aPerformance: Performance) {
    return plays[aPerformance.playID];
  }
}
