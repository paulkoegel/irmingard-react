import { CardRecord } from 'setup';

export default function restoreFromShortCardId (shortCardId) {
  const match = /([cdhs])(\d+)([ab])/.exec(shortCardId);
  const shortSuit = match[1];
  const suit = (() => {
    switch (shortSuit) {
      case 'c':
        return 'clubs';
      case 'd':
        return 'diamonds';
      case 'h':
        return 'hearts';
      case 's':
        return 'spades';
      default:
        throw new Error(`restoreFromShortCardId: could not restore from this shortSuit: ${shortSuit}`);
    }
  })();
  const value = parseInt(match[2], 10);

  return new CardRecord({
    suit,
    value
  });
}
