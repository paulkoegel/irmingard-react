export default function cardId (card) {
  const { deck, suit, value } = card;
  return [deck, suit, value].join('.');
}
