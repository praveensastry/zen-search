import * as stream from "stream";
import { noop } from "lodash/fp";

export const createMockReadableStream = () => {
  const s = new stream.Readable();
  s._read = noop;

  return s;
};

export const createMockWritableStream = () => {
  const s = new stream.Writable();
  s._write = noop;

  return s;
};
