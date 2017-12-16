export default function symbolForSuit (suit) {
  switch (suit) {
    case 'spades':
      return '♠';
    case 'hearts':
      return '♥';
    case 'diamonds':
      return '♦';
    case 'clubs':
      return '♣';
    default:
      throw (new Error(`symbolForSuit: couldn't find a symbol for this suit: ${JSON.stringify(suit)}`));
  }
}
