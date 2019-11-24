import * as searchStreamModule from "../../search/searchStream";
import { createMockReadableStream } from "../../utils/mock/streams";
import * as Future from "fluture";
import * as prompts from "./prompts";
import { setState } from "../../state";
import { createMockWritableStream } from "../../utils/mock/streams";
import * as getFilesModule from "../../utils/getFiles";
import { steps } from "./steps";

const fakeState = setState(undefined, {
  config: {
    dataDir: "foo"
  },
  field: "fakeField",
  file: "fakeFile",
  filesList: ["foo", "bar"],
  inStream: createMockReadableStream(),
  outStream: createMockWritableStream(),
  term: "fakeTerm"
});

const stepTests = [
  {
    fn: steps.getSearchableFiles,
    shouldCall: jest.spyOn(getFilesModule, "getFiles"),
    with: [fakeState.config.dataDir]
  },
  {
    fn: steps.getSelectedFile,
    shouldCall: jest.spyOn(prompts, "fileSelectionPrompt"),
    with: [fakeState.filesList]
  },
  {
    fn: steps.getSearchField,
    shouldCall: jest
      .spyOn(prompts, "fieldSelectionPrompt")
      .mockReturnValue(Future.of({ value: "foo" })),
    with: [fakeState.file]
  },
  {
    fn: steps.getSearchQuery,
    shouldCall: jest.spyOn(prompts, "queryInputPrompt"),
    with: []
  },
  {
    fn: steps.search,
    shouldCall: jest.spyOn(searchStreamModule, "searchInStream"),
    with: [
      fakeState.inStream,
      fakeState.field,
      fakeState.term,
      fakeState.outStream
    ]
  }
];

stepTests.forEach(test => {
  describe(test.fn.name, () => {
    it("should function correctly", () => {
      test.shouldCall.mockImplementation(() => Future.of({}) as any);
      test.fn(fakeState);

      expect(test.shouldCall).toHaveBeenCalledWith(...test.with);
    });
  });
});
