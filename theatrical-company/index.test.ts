import invoices from "./invoices.json";
import { output } from "./desired-output.json";
import { statement } from "./index";

test("Statement output", () => {
  const statementOutput = statement(invoices[0]);
  expect(statementOutput).toEqual(output);
});
