import { Readable } from "stream";
import { chain } from "stream-chain";
import { parser } from "stream-json";
import { pick } from "stream-json/filters/Pick";
import { streamValues } from "stream-json/streamers/StreamValues";

import { keys } from "lodash/fp";
import * as Future from "fluture";

export const getSearchableFields = (readStream: Readable) => {
  const fields = [];

  const pipe = chain([
    readStream,
    parser(),
    pick({ filter: /^0/ }),
    streamValues(),
    ({ value }) => {
      return keys(value);
    }
  ]);

  pipe.on("data", key => {
    fields.push(key);
  });

  return Future.node<Error, string[]>(done => {
    pipe.on("end", () => done(null, fields));
    pipe.on("error", error => done(error));
  });
};
