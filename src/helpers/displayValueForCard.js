export default function displayValueForCard (card) {
  const value = card.get('value');
  if (value === 1) {
    return 'A';
  } else if (value === 11) {
    return 'J';
  } else if (value === 12) {
    return 'Q';
  } else if (value === 13) {
    return 'K';
  } else if (value > 1 && value < 11) {
    return value.toString();
  } else {
    throw new Error(`displayValueForCard: could not find a displayValue for this value: ${JSON.stringify(value, null, 2)} for card: ${JSON.stringify(card, null, 2)}`);
  }
}
