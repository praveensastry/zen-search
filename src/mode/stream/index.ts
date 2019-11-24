import { setState, State } from "../../state";
import * as Future from "fluture";
import { logError, logResults } from "../../utils/logs";
import { searchInStream } from "../../search/searchStream";

export const streamSearch = (field: string, query: string) => {
  Future.of<Error, State>(
    setState(undefined, {
      field,
      inStream: process.stdin,
      outStream: process.stdout,
      term: query
    })
  )
    .chain(state => {
      console.log("searching in input stream...");
      return searchInStream(
        state.inStream,
        state.field,
        state.term,
        state.outStream
      ).map(({ count, time }) =>
        setState(state, { resultCount: count, searchTime: time })
      );
    })
    .fork(
      error => logError(error),
      state => logResults(state)
    );
};
