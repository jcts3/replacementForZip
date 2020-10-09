const timeOrder = "yMdhms";
const timeDict = {
  d: "Date", // 1-31
  M: "Month", // NB. Month is 0-11 (this is fine if we use relatives!)
  y: "Year", // NB. Year is based off of 1900
  h: "Hours", // 0-23
  m: "Minutes", // 0-59
  s: "Seconds", // 0-59
  w: "Week" // will need separate functionality for this too as weeks don't exist
};

const example = "2020-05-01T00:00:00";

// Presuming that all week sized differences can be presented in terms of days.
const stringify = dateObj => {
  const now = new Date().valueOf(); // taking Epoch time makes things a world easier..
  const then = new Date(dateObj).valueOf();
  let sign = "-";
  let diff = now - then;
  if (diff < 0) {
    sign = "+";
    diff = 0 - diff;
  }
  const diffDate = new Date(diff);

  const unitArray = timeOrder.split("");
  const diffArray = unitArray.map(unitStr => {
    const unit = timeDict[unitStr];
    console.log({ unit, now, then });
    let diffUnit = diffDate[`get${unit}`]();
    if (unitStr === "y") {
      diffUnit = diffUnit - 70; // because of year0 = 1900
    }

    return { unitStr, diffUnit };
  });
  return buildExpression(diffArray, sign);
};

const buildExpression = (array, sign) => {
  return array.reduce((acc, cur) => {
    return `${acc}${sign}${cur.diffUnit}${cur.unitStr}`;
  }, "now");
};

module.exports = {
  stringify
};
