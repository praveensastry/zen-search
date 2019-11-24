import { Readable, Writable } from "stream";
import { isString, identity, isEmpty } from "lodash/fp";
import * as Future from "fluture";
import { chain } from "stream-chain";
import { parser } from "stream-json";
import { streamArray } from "stream-json/streamers/StreamArray";
import { prettifyResult } from "../utils/logs";

export const searchArrayObject = (field: string, regex: RegExp) => data => {
  if (isEmpty(data.value)) {
    return null;
  }

  const searchValue = isString(data.value[field])
    ? data.value[field]
    : JSON.stringify(data.value[field]) || "";

  return searchValue.match(regex) ? data : null;
};

export const searchInStream = (
  readStream: Readable,
  arrayObject: string,
  term: string,
  writeStream: Writable,
  search = searchArrayObject
) => {
  const regex = new RegExp(term);

  let count = 0;
  let results = [];

  const pipe = chain([
    readStream,
    parser(),
    streamArray(),
    search(arrayObject, regex)
  ]);

  const startTime = Date.now();

  pipe.on("data", result => {
    count++;
    results.push(result);
    writeStream.write(prettifyResult(result));
    writeStream.write("\n");
  });

  return Future.node<Error, { count: number; time: number; results: any[] }>(
    done => {
      pipe.on("end", () => {
        const endTime = Date.now();
        done(null, { results: results, count, time: endTime - startTime });
      });

      pipe.on("error", error => done(error));
    }
  );
};
