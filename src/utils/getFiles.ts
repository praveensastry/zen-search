import * as fs from "fs";
import { map, filter, toLower, endsWith, pipe } from "lodash/fp";
import * as Future from "fluture";

export const filterForJSON = pipe(map(toLower), filter(endsWith(".json")));

export const getFiles = (dirPath: string) =>
  Future.node<NodeJS.ErrnoException, string[]>(done =>
    fs.readdir(dirPath, "utf8", done)
  ).map(filterForJSON);
