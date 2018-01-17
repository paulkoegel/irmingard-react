export default function unmarkAllCards (gameState) {
  return gameState.updateIn(['markedCardCoordinates'], markedCardCoordinates => []);
}
