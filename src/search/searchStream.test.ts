import { createMockWritableStream } from "../utils/mock/streams";
import { createMockReadableStream } from "../utils/mock/streams";
import { identity } from "lodash/fp";
import { searchArrayObject, searchInStream } from "./searchStream";

describe("search ", () => {
  it("should be able to search for a pattern", () => {
    const node = "foo";
    const regex = new RegExp("match[0-9]");

    const search = searchArrayObject(node, regex);

    const testCases = [
      {
        data: {
          bar: "none"
        },
        isMatch: false
      },
      {
        data: {
          foo: "matchx"
        },
        isMatch: false
      },
      {
        data: {
          foo: "match1"
        },
        isMatch: true
      },
      {
        data: {
          foo: ["nomatch", "match2"]
        },
        isMatch: true
      }
    ];
    testCases.forEach(test => {
      const data = { value: test.data };
      expect(search(data)).toBe(test.isMatch ? data : null);
    });
  });
});

describe("search in a Stream", () => {
  it("should be able to handle a stream and call array object search", () => {
    const readable = createMockReadableStream();
    const writable = createMockWritableStream();

    const mockNode = "foo";
    const mockTerm = "bar";

    const mockData = [
      {
        foo: 1
      },
      {
        foo: 2
      },
      {
        foo: 3
      }
    ];

    const mockSearchNodeFn = jest.fn().mockImplementation(() => identity);

    searchInStream(readable, mockNode, mockTerm, writable, mockSearchNodeFn)
      .promise()
      .then(result => {
        expect(mockSearchNodeFn).toHaveBeenCalledTimes(1);
        expect(result.count).toBe(mockData.length);
      });

    readable.emit("data", JSON.stringify(mockData));
    readable.emit("end");
  });

  it("should be able handle a stream error", () => {
    const readable = createMockReadableStream();
    const writable = createMockWritableStream();

    const mockNode = "foo";
    const mockTerm = "bar";
    const mockError = "malformedxx";

    const mockSearchFn = jest.fn().mockImplementation(() => identity);

    searchInStream(readable, mockNode, mockTerm, writable, mockSearchFn)
      .promise()
      .catch(error => {
        expect(error.message).toBe(mockError);
      });

    readable.emit("data", "foobar");
    readable.emit("error", new Error(mockError));
    readable.emit("end");
  });
});
