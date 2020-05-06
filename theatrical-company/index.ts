import invoicesRaw from "./invoices.json";
import playsRaw from "./plays.json";

type Performance = { playID: string; audience: number };

type EnrichedPerformance = {
  playID: string;
  audience: number;
  play: Play;
  amount: number;
  volumeCredits: number;
};

type StatementData = {
  customer: string;
  performances: EnrichedPerformance[];
  totalAmount: number;
  totalVolumeCredits: number;
};

type Invoice = {
  customer: string;
  performances: Performance[];
};

type Play = {
  name: string;
  type: string;
};

type Plays = {
  [key: string]: Play;
};

const invoices = invoicesRaw as Invoice[];
const plays = playsRaw as Plays;

export function statement(invoice: Invoice, plays: Plays) {
  const statementData: any = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  return renderPlainText(statementData, invoice, plays);
}
function totalVolumeCredits(data: StatementData) {
  let result = 0;
  for (let perf of data.performances) {
    result += perf.volumeCredits;
  }
  return result;
}

function totalAmount(data: StatementData) {
  let result = 0;
  for (let perf of data.performances) {
    result += perf.amount;
  }
  return result;
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

function renderPlainText(data: StatementData, invoice: Invoice, plays: Plays) {
  let result = `Statement for ${data.customer}\n`;

  for (let perf of data.performances) {
    // print line for order
    result += `${perf.play.name}: ${usd(perf.amount)} (${
      perf.audience
    } seats)\n`;
  }

  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;
  return result;

  function usd(aNumber: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumIntegerDigits: 2,
    }).format(aNumber / 100);
  }
}
// for (let invoice of invoicesJson) {
//   console.log(statement(invoice, playsJson));

// }
