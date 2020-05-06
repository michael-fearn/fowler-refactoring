import invoices from "./invoices.json";
import plays from "./plays.json";
import { text, html } from "./desired-output.json";
import { statement, htmlStatement } from "./render";

test("Statement output", () => {
  expect(statement(invoices[0], plays)).toEqual(text);
  expect(htmlStatement(invoices[0], plays)).toEqual(html);
});
