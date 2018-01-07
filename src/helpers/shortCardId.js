export default function shortCardId (card) {
  const { deck, suit, value } = card;
  return `${suit[0]}${value}${deck}`;
}
