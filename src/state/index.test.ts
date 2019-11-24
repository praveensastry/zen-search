import { setState } from ".";

describe("application state", () => {
  it("should initialize properly", () => {
    expect(setState(undefined, {})).toMatchInlineSnapshot(`Object {}`);
  });

  it("should update existing keys", () => {
    const prev = setState(undefined, {
      field: "bar1",
      filesList: ["baz1", "baz1"]
    });

    const newField = "bar2";

    expect(setState(prev, { field: newField }).field).toBe(newField);
  });

  it("should not change non-updated keys", () => {
    const prev = setState(undefined, {
      field: "bar1",
      term: "term1"
    });

    expect(setState(prev, { field: "bar2" }).term).toBe(prev.term);
  });
});
