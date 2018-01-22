### TODO

+ detect when game is won
+ add audio when game is won / cannot be won and win screen


+ refactor code:
  - add functions that make what happens on clicks more readable
  - don't distinguish columns and piles by index (e.g. `if (markedColIndex > TOTAL_COLUMNS-1) return; // when card in pile is selected`); use something like `{ columnOrPile: 'pile', index: 2, ... }` for event payloads instead.

+ initial game state: don't start with ace discarded on pile. Instead, it should be open at the end of a random column.

+ card in column is selected with moveable cards above it. when clicking on a higher moveable card in the same column, just update the move index accordingly. current behaviour: nothing gets selected.

+ add seed number so the exact same game can be shared