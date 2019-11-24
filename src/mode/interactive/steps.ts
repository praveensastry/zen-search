import { FutureInstance } from "fluture";
import * as invariant from "invariant";

import { searchInStream } from "../../search/searchStream";
import { setState, State } from "../../state";
import { dataStream } from "../../utils/dataStream";
import { getFiles } from "../../utils/getFiles";
import { report } from "../../utils/report";
import {
  fieldSelectionPrompt,
  fileSelectionPrompt,
  queryInputPrompt
} from "../interactive/prompts";

type ChainableStep = (s: State) => FutureInstance<Error, State>;

const getSearchableFiles: ChainableStep = state =>
  getFiles(state.config.dataDir).map(filesList =>
    setState(state, { filesList })
  );

const getSelectedFile: ChainableStep = state =>
  fileSelectionPrompt(state.filesList).map(answer =>
    setState(state, {
      file: answer.value,
      inStream: dataStream(answer.value)
    })
  );

const getSearchField: ChainableStep = state =>
  fieldSelectionPrompt(state.file).map(answer =>
    setState(state, { field: answer.value })
  );

const getSearchQuery: ChainableStep = state =>
  queryInputPrompt().map(answer => setState(state, { term: answer.value }));

const search: ChainableStep = state => {
  report.info(`Searching ${state.file} for ${state.field}: ${state.term}`);

  invariant(state.inStream, "Input stream must be set");
  invariant(state.field, "Search field must be set");
  invariant(state.term, "Search term must be set");
  invariant(state.outStream, "Output stream must be set");

  return searchInStream(
    state.inStream,
    state.field,
    state.term,
    state.outStream
  ).map(({ count, time, results }) =>
    setState(state, { resultCount: count, searchTime: time, results })
  );
};

export const steps = {
  getSearchField,
  getSearchQuery,
  getSearchableFiles,
  getSelectedFile,
  search
};
