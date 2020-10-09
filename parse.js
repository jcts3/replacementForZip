const timeDict = {
  d: "Date", // 1-31
  M: "Month", // NB. Month is 0-11 (this is fine if we use relatives!)
  y: "Year", // NB. Year is based off of 1900
  h: "Hours", // 0-23
  m: "Minutes", // 0-59
  s: "Seconds", // 0-59
  w: "Week" // will need separate functionality for this too as weeks don't exist
};
const timeOrder = " yMdhms";

const parse = dateString => {
  const now = new SuperDate();

  const length = dateString.length;
  const splitArray = dateString.match(/.{1,3}/g);
  // split up every 3 characters
  splitArray.shift();
  // removes the 'now', which is redundant as it's in every option

  let roundingString = "";
  if (length % 3 !== 0) {
    // Contains rounding (as rounding using 2chars, all others use 3)
    roundingString = splitArray.pop();
  }
  splitArray.forEach(str => {
    const sign = str[0];
    const value = str[1];
    const unit = timeDict[str[2]];
    console.log({ sign, value, unit });
    now[`change${unit}`](sign, value);
  });
  if (roundingString !== "") {
    now.performRounding(roundingString[1]);
  }
  return now.parseToString();
};

class SuperDate {
  constructor() {
    this.date = new Date();
  }

  changeDate(sign, value) {
    const oldDate = this.date.getUTCDate();
    const modifier = useSign[sign](oldDate, value);
    this.date.setUTCDate(modifier);
  }
  changeWeek(sign, value) {
    this.changeDate(sign, value * 7);
  }
  // due to the complication of a week, wasn't able to make a general function.
  changeYear(sign, value) {
    const oldYear = this.date.getUTCFullYear(); // FullYear gets round the 1900 issue
    const modifier = useSign[sign](oldYear, value);
    this.date.setUTCFullYear(modifier);
  }
  changeMonth(sign, value) {
    const oldMonth = this.date.getUTCMonth();
    const modifier = useSign[sign](oldMonth, value);
    this.date.setUTCMonth(modifier);
  }
  changeHours(sign, value) {
    const oldHours = this.date.getUTCHours();
    const modifier = useSign[sign](oldHours, value);
    this.date.setUTCHours(modifier);
  }
  changeMinutes(sign, value) {
    const oldMinutes = this.date.getUTCMinutes();
    const modifier = useSign[sign](oldMinutes, value);
    this.date.setUTCMinutes(modifier);
  }
  changeSeconds(sign, value) {
    const oldSeconds = this.date.getUTCSeconds();
    // console.log({ oldSeconds, sign, value, dat: this.date }); // Can be used for checking if second modifier is actually working.
    const modifier = useSign[sign](oldSeconds, value);
    this.date.setUTCSeconds(modifier);
  }
  performRounding(topUnitToRound) {
    const arrayToRound = timeOrder.split(topUnitToRound)[1].split("");
    arrayToRound.forEach(unitStr => {
      console.log(this.date);
      let value = 0;
      if (unitStr === "d") {
        value = 1;
      }
      const unit = timeDict[unitStr];
      this[`change${unit}`]("/", value);
    });
  }

  parseToString() {
    return this.date.toISOString().substring(0, 19);
  }
}

const useSign = {
  "+": (x, y) => parseInt(x) + parseInt(y),
  "-": (x, y) => parseInt(x) - parseInt(y),
  "/": (x, y) => y
};

module.exports = {
  parse
};
