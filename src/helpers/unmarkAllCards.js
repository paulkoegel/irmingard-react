export default function unmarkAllCards (gameState) {
  return gameState.updateIn(['movingCoordinates'], movingCoordinates => []);
}
