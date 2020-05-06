import {
  Invoice,
  Plays,
  Play,
  StatementData,
  Performance,
  EnrichedPerformance,
} from "./types";

abstract class PerformanceCalculator {
  public performance: Performance;
  public play: Play;

  constructor(performance: Performance, play: Play) {
    this.performance = performance;
    this.play = play;
  }

  abstract get amount(): number;

  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}
class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }
  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
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

export function createStatementData(invoice: Invoice, plays: Plays) {
  const statementData: any = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  return statementData;

  function totalVolumeCredits(data: StatementData) {
    return data.performances.reduce(
      (total, p) => (total += p.volumeCredits),
      0
    );
  }

  function totalAmount(data: StatementData) {
    return data.performances.reduce((total, p) => (total += p.amount), 0);
  }

  function enrichPerformance(aPerformance: Performance): EnrichedPerformance {
    const calculator = createPerformanceCalculator(
      aPerformance,
      playFor(aPerformance)
    );
    const result: any = Object.assign({}, aPerformance);
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result;
  }
  function playFor(aPerformance: Performance) {
    return plays[aPerformance.playID];
  }
}
