import invoices from "./invoices.json";
import plays from "./plays.json";
import { output } from "./desiredOutput.json";
import { statement } from "./index";

test("Statement output", () => {
  const statementOutput = statement(invoices[0], plays);
  expect(statementOutput).toEqual(output);
});
