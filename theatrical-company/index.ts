import { Invoice, StatementData } from "./types";
import { createStatementData } from "./create-statement-data";
import invoicesRaw from "./invoices.json";
const invoices = invoicesRaw as Invoice[];

export function statement(invoice: Invoice) {
  return renderPlainText(createStatementData(invoice));
}

function renderPlainText(data: StatementData) {
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
