export default function colourForSuit (suit) {
  if (['diamonds', 'hearts'].includes(suit)) {
    return 'red';
  } else if (['clubs', 'spades'].includes(suit)) {
    return 'black';
  } else {
    throw (new Error(`colourForSuit: passed-in suit (${JSON.stringify(suit)}) is neither red nor black!?`));
  }
}
