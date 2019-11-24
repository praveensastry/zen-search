import { identity, values } from "lodash/fp";
import { report } from "./report";

it("should print on all configurations", () => {
  const consoleLogSpy = jest
    .spyOn(global.console, "log")
    .mockImplementation(identity);

  values(report).forEach((fn, i) => {
    const message = "message in a bottle";
    fn(message);
    expect(consoleLogSpy.mock.calls[i][0]).toContain(message);
  });

  consoleLogSpy.mockRestore();
});
