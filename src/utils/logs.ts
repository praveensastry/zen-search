import * as prettyjson from "prettyjson";

import { State } from "../state";
import { report } from "./report";

export const logResults = (state: State) => {
  const source = state.file === undefined ? "Standard Input" : state.file;
  report.success(
    `${state.resultCount} result(s) returned for Query:${state.field}(${state.term}) in ${source}`
  );
};

export const prettifyResult = result =>
  ["---", prettyjson.render(result)].join("\n");

export const logError = (error: Error) =>
  ["Unexpected error!", error.message].forEach(report.error);
