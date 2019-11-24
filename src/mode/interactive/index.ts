import { State, setState } from "../../state";
import * as Future from "fluture";
import { logError, logResults } from "../../utils/logs";
import { steps } from "./steps";
import { config } from "../../config";
import { dataStream } from "../../utils/dataStream";
import { red } from "chalk";
import { map, isEmpty } from "lodash/fp";

const dataRelationMap = {
  organizations: {
    relatedFiles: [],
    relatedFields: []
  },
  tickets: {
    relatedFiles: ["users", "users", "organizations"],
    relatedFields: ["_id", "_id", "_id"],
    termFields: ["assignee_id", "submitter_id", "organization_id"]
  },
  users: {
    relatedFiles: ["tickets", "tickets", "organizations"],
    relatedFields: ["assignee_id", "submitter_id", "_id"],
    termFields: ["_id", "_id", "organization_id"]
  }
};

const searchForRelatedItems = (state: State) => {
  const relation = dataRelationMap[state.file.split(".")[0]];
  const userSearchResults = state.results;

  if (isEmpty(relation.relatedFiles)) {
    console.log(red("No related results found"));
  }

  relation.relatedFiles.map((file, index) => {
    userSearchResults.map(result => {
      console.log(result);
      console.log(relation.relatedFields[index]);
      Future.of<Error, State>(
        setState(
          {},
          {
            config,
            field: relation.relatedFields[index],
            inStream: dataStream(`${file}.json`),
            file: `${file}.json`,
            term: result.value[relation.termFields[index]],
            outStream: process.stdout
          }
        )
      )
        .chain(steps.search)
        .fork(
          error => logError(error),
          state => {
            logResults(state);
          }
        );
    });
  });
};

export const interactiveSearch = () => {
  console.log(red("Search Query Results:"));
  Future.of<Error, State>(
    setState(
      {},
      {
        config,
        outStream: process.stdout
      }
    )
  )
    .chain(steps.getSearchableFiles)
    .chain(steps.getSelectedFile)
    .chain(steps.getSearchField)
    .chain(steps.getSearchQuery)
    .chain(steps.search)
    .fork(
      error => logError(error),
      state => {
        logResults(state);
        console.log(red("Related Results:"));
        searchForRelatedItems(state);
      }
    );
};
