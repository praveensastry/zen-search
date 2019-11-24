import * as program from "commander";
import { interactiveSearch } from "./mode/interactive";
import { streamSearch } from "./mode/stream";
import { textSync } from "figlet";
import { red } from "chalk";
import { isEmpty } from "lodash/fp";

console.clear();
console.log(red(textSync("zen-search", { horizontalLayout: "full" })));

program
  .option("-m --mode [mode]", "Search Mode: interactive or stream")
  .option("-f --field [field]", "Field to search")
  .option("-q --query [query]", "Search Query")
  .parse(process.argv);

if (isEmpty(program.mode) || program.mode === "interactive") {
  interactiveSearch();
} else if (program.mode === "stream") {
  const searchField = program.field;
  const query = program.query;

  if (!(isEmpty(searchField) || isEmpty(query))) {
    streamSearch(searchField, query);
  } else {
    program.outputHelp(
      x => `${red("Field and Query are required in stream mode")}\n${x}`
    );
  }
} else {
  program.outputHelp();
}
