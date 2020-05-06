import {
  Invoice,
  Plays,
  Play,
  StatementData,
  Performance,
  EnrichedPerformance,
} from "./types";

class PerformanceCalculator {
  private performance: Performance;
  public play: Play;
  constructor(performance: Performance, play: Play) {
    this.performance = performance;
    this.play = play;
  }

  get amount() {
    let result = 0;
    switch (this.play.type) {
      case "tragedy":
        result = 40000;
        if (this.performance.audience > 30) {
          result += 1000 * (this.performance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        break;
      default:
        throw new Error(`unknown type: ${this.play.type}`);
    }
    return result;
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
    const calculator = new PerformanceCalculator(
      aPerformance,
      playFor(aPerformance)
    );
    const result: any = Object.assign({}, aPerformance);
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = volumeCreditsFor(result);
    return result;
  }

  function volumeCreditsFor(aPerformance: EnrichedPerformance) {
    let results = 0;
    results += Math.max(aPerformance.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ("comedy" === aPerformance.play.type)
      results += Math.floor(aPerformance.audience / 5);

    return results;
  }

  function playFor(aPerformance: Performance) {
    return plays[aPerformance.playID];
  }
}
