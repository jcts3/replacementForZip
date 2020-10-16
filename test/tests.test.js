const { stringify } = require("../stringify");
const { parse, SuperDate, getSplitArray } = require("../parse");

const baseDateStringArray = [
  "now-1y/y",
  "now/y",
  "now-1d",
  "now+10d",
  "now-4d-4h"
];
const baseDateArray = [
  "2019-01-01T00:00:00",
  "2020-01-01T00:00:00",
  "2020-04-30T00:00:00",
  "2020-05-11T00:00:00",
  "2020-04-26T20:00:00"
];

const cloneDateStringArray = () => [...baseDateStringArray];
const cloneDateArray = () => [...baseDateArray];
// not using lodash const

describe("parse should take a datestring and return a date", () => {
  beforeAll(() => {
    Date.now = jest.fn(() => new Date(Date.UTC(2020, 4, 1)));
  });

  afterAll(() => {
    spy.mockRestore();
  });

  test("it should handle a change of a single unit happy path case", () => {
    const input = "now-9d";
    const expectation = "2020-04-22T00:00:00";
    const result = parse(input);
    expect(result).toEqual(expectation);
  });

  test("it should handle rounding happy path case", () => {
    const input = "now/M";
    const expectation = "2020-05-01T00:00:00";
    const result = parse(input);
    expect(result).toEqual(expectation);
  });

  test("it should handle a unit change and rounding", () => {
    const input = "now-3d/M";
    const expectation = "2020-04-01T00:00:00";
    const result = parse(input);
    expect(result).toEqual(expectation);
  });

  test("it should handle two unit changes", () => {
    const input = "now-3d+7h";
    const expectation = "2020-04-28T07:00:00";
    const result = parse(input);
    expect(result).toEqual(expectation);
  });

  test("it should handle double digit unit changes", () => {
    // This one failed, so fixed regex
    const input = "now+10d+23h";
    const expectation = "2020-05-11T23:00:00";
    const result = parse(input);
    expect(result).toEqual(expectation);
  });

  test("it should handle double digit and rounding", () => {
    // This one failed, so fixed regex
    const input = "now+10M-13d/M";
    const expectation = "2021-02-01T00:00:00";
    const result = parse(input);
    expect(result).toEqual(expectation);
  });

  test("it should handle everything", () => {
    const input = "now-1y+2M-3d+4h-5m+6s";
    const expectation = "2019-06-28T03:55:06";
    const result = parse(input);
    expect(result).toEqual(expectation);
  });

  test("check base happy path cases", () => {
    const testInputs = cloneDateStringArray();
    const result = testInputs.map(input => {
      return parse(input);
    });
    const expectation = cloneDateArray();
    expect(result).toEqual(expectation);
  });
  describe("getSplitArray should split datestrings properly", () => {
    const inputs = cloneDateStringArray();
    const expectation = [
      ["-1y", "/y"],
      ["/y"],
      ["-1d"],
      ["+10d"],
      ["-4d", "-4h"]
    ];
    const result = inputs.map(input => {
      return getSplitArray(input);
    });
    expect(result).toEqual(expectation);
  });

  describe("SuperDate should be able to have values changed", () => {
    test("changeDate should change the date in the given way", () => {
      const sd = new SuperDate();
      expect(sd.date.valueOf()).toEqual(Date.UTC(2020, 4, 1));
      sd.changeDate("+", 3);
      expect(sd.date.valueOf()).toEqual(Date.UTC(2020, 4, 4));
    });
    test("changeWeek should change the date in the given way", () => {
      const sd = new SuperDate();
      expect(sd.date.valueOf()).toEqual(Date.UTC(2020, 4, 1));
      sd.changeWeek("+", 3);
      expect(sd.date.valueOf()).toEqual(Date.UTC(2020, 4, 22));
    });
    // etc. etc.
    test("performRounding should round to the given unit", () => {
      const sd = new SuperDate();
      expect(sd.date.valueOf()).toEqual(Date.UTC(2020, 4, 1));
      sd.performRounding("y");
      expect(sd.date.valueOf()).toEqual(Date.UTC(2020, 0, 1));
    });
  });
});

// same file for reuse of fixtures - if extending would split out.
describe("stringify should take a given date, and return a datestring relative to now", () => {
  beforeAll(() => {
    Date.now = jest.fn(() => new Date(Date.UTC(2020, 4, 1)));
  });

  afterAll(() => {
    spy.mockRestore();
  });
  test("it should take a date and return just now when given the current time", () => {
    const input = "2020-05-01T00:00:00";
    const expectation = "now";
    const result = stringify(input);
    expect(result).toEqual(expectation);
  });
  test("it should take a date and return a dateString", () => {
    const input = "2020-05-10T00:00:00";
    const expectation = "now+9d";
    const result = stringify(input);
    expect(result).toEqual(expectation);
  });
  test("it should take a date and return a dateString negative", () => {
    const input = "2020-04-22T00:00:00";
    const expectation = "now-9d";
    const result = stringify(input);
    expect(result).toEqual(expectation);
  });

  test("it should handle everything negatively", () => {
    const input = "2019-04-27T19:54:54";
    const expectation = "now-1y-3d-4h-5m-6s";
    const result = stringify(input);
    expect(result).toEqual(expectation);
  });
  test("it should handle everything positively", () => {
    const input = "2021-05-04T04:05:06";
    const expectation = "now+1y+3d+4h+5m+6s";
    const result = stringify(input);
    expect(result).toEqual(expectation);
  });
});
