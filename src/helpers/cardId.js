export default function cardId (card) {
  const { suit, value } = card;
  return [suit, value].join('.');
}
