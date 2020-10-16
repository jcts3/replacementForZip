# Notes & Comments

- Rounding to the nearest week has not been implemented - Limitation of the JS Date object, was decided this was a lot of work to cover one edge case. Also, is a rounded week on a Monday or a Sunday...
- I got caught in bug catching for about 30 minutes until realising it was that:

```js
i = "9" - 1; // = 8
i = "9" + 1; // = 91
```

## Post adding testing comments

- Something I realised when rediving into the code was the inability to handle double digit units as an input when parsing (e.g. 10M, 23h). Therefore the edge case where someone wants to subtract 10 or 11 months wasn't covered - this was the main change I made to the parse code.
- Leap years haven't been accounted for in terms of date order (i.e. if a request is `'now-1d-1y'` from March 1st 2020, that's handled differently from `'now-1y-1d'` which is the expected input)
- On a similar note, haven't fully investigated the edge case of a day difference amount of >28.
- Stringify isn't fully functional. It works for hours/mins/seconds/years, but falls over with Dates and Months. My approach didn't account for months being of varying lengths, so dates and months don't fully work.

### Code changes

- Added testing, couple of unit tests for function/classes used, and integration tests for parse and stringify (if that level counts as integration...)
- Introduced use of Date.now for ease of mocking for testing
- Accounted for numbers bigger than 9 in parse.js
- Fixed UTC issue with stringify
- Stopped all time-units being output for stringify
- Partial fix for date issue.
