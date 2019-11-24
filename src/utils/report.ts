import { red, blue, magenta, green } from "chalk";

const config = {
  error: {
    decorator: red,
    prefix: "! "
  },
  info: {
    decorator: blue,
    prefix: "> "
  },
  result: {
    decorator: magenta,
    prefix: "---\n"
  },
  success: {
    decorator: green,
    prefix: "✔ "
  }
};

const logger = (level: typeof config.info) => (message: string) =>
  // tslint:disable-next-line: no-console
  console.log(level.decorator(`${level.prefix}${message}`));

export const report = {
  error: logger(config.error),
  info: logger(config.info),
  result: logger(config.result),
  success: logger(config.success)
};
