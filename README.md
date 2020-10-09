# Notes & Comments

- Rounding to the nearest week has not been implemented - Limitation of the JS Date object, was decided this was a lot of work to cover one edge case. Also, is a rounded week on a Monday or a Sunday...
- I got caught in bug catching for about 20 minutes until realising it was that:

```js
i = "9" - 1; // = 8
i = "9" + 1; // = 91
```
