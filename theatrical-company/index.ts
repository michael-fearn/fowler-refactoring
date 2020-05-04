import invoicesRaw from "./invoices.json";
import playsRaw from "./plays.json";

type Performance = { playID: string; audience: number };

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

function amountFor(aPerformance: Performance) {
  let result = 0;
  switch (playFor(aPerformance).type) {
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
      throw new Error(`unknown type: ${playFor(aPerformance).type}`);
  }
  return result;
}

function playFor(aPerformance: Performance) {
  return plays[aPerformance.playID];
}

function volumeCreditsFor(aPerformance: Performance) {
  let results = 0;
  results += Math.max(aPerformance.audience - 30, 0);
  // add extra credit for every ten comedy attendees
  if ("comedy" === playFor(aPerformance).type)
    results += Math.floor(aPerformance.audience / 5);

  return results;
}

function usd(aNumber: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumIntegerDigits: 2,
  }).format(aNumber / 100);
}

export function statement(invoice: Invoice) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;

  for (let perf of invoice.performances) {
    // print line for order
    result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${
      perf.audience
    } seats)\n`;
    totalAmount += amountFor(perf);
  }
  for (let perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf);
  }

  result += `Amount owed is ${usd(totalAmount)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;
}
// for (let invoice of invoicesJson) {
//   console.log(statement(invoice, playsJson));

// }
