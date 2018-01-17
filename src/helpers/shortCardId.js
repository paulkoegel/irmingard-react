export default function shortCardId (card) {
  const { suit, value } = card;
  return `${suit[0]}${value}`;
}
