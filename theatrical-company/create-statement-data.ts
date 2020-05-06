import {
  Invoice,
  Plays,
  StatementData,
  Performance,
  EnrichedPerformance,
} from "./types";
import playsRaw from "./plays.json";
const plays = playsRaw as Plays;

export function createStatementData(invoice: Invoice) {
  const statementData: any = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  return statementData;
}

function totalVolumeCredits(data: StatementData) {
  return data.performances.reduce((total, p) => (total += p.volumeCredits), 0);
}

function totalAmount(data: StatementData) {
  return data.performances.reduce((total, p) => (total += p.amount), 0);
}

function enrichPerformance(aPerformance: Performance): EnrichedPerformance {
  const result: any = Object.assign({}, aPerformance);
  result.play = playFor(aPerformance);
  result.amount = amountFor(result);
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

function amountFor(aPerformance: EnrichedPerformance) {
  let result = 0;
  switch (aPerformance.play.type) {
    case "tragedy":
      result = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;
    case "comedy":
      result = 30000;
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20);
      }
      result += 300 * aPerformance.audience;
      break;
    default:
      throw new Error(`unknown type: ${aPerformance.play.type}`);
  }
  return result;
}
