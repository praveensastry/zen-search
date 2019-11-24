import * as fs from "fs";
import * as prompts from "prompts";
import { getSearchableFields } from "../../search/getSearchableFields";
import { dataStream } from "../../utils/dataStream";
import * as Future from "fluture";

const lazyPrompt = Future.encaseP<
  Error,
  prompts.Answers<string>,
  prompts.PromptObject<string> | Array<prompts.PromptObject<string>>
>(prompts);

export const fileSelectionPrompt = (filesList: string[]) =>
  lazyPrompt({
    choices: filesList.map(file => ({ title: file, value: file })),
    message: "Select a file to search:",
    name: "value",
    type: "select"
  });

export const fieldSelectionPrompt = (file: string) =>
  Future.of<Error, fs.ReadStream>(dataStream(file))
    .chain(stream => getSearchableFields(stream))
    .chain(fields =>
      lazyPrompt({
        choices: fields.map(field => ({ title: field, value: field })),
        message: "Select a field to search:",
        name: "value",
        type: "select"
      })
    );

export const queryInputPrompt = () =>
  lazyPrompt({
    message: "Enter search pattern:",
    name: "value",
    type: "text"
  });
