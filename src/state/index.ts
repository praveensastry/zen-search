import { Readable, Writable } from "stream";

export type State = {
  config: {
    dataDir: string;
  };
  field: string;
  file: string;
  filesList: any[];
  inStream: Readable;
  outStream: Writable;
  resultCount: number;
  searchTime: number;
  term: string;
  results: any[];
};

export const setState = (prevState, newState: Partial<State>) => ({
  ...prevState,
  ...newState
});
