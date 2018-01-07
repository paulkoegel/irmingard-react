import { min, pipe, range } from 'ramda';
import { serveCardToColumn, TOTAL_COLUMNS } from 'setup';
import unmarkAllCards from 'helpers/unmarkAllCards';
import colourForSuit from 'helpers/colourForSuit';

const serveNewCardsToColumns = gameState => {
  const cardsToServe = min(TOTAL_COLUMNS, gameState.stack.size);
  const newGameState = range(0, cardsToServe).reduce((memo, columnIndex) => {
    const daGameState = serveCardToColumn(memo, columnIndex);

    return daGameState
      .updateIn(['columns', columnIndex, 'moveableFromIndex'], moveableFromIndex => {
        const column = daGameState.columns.get(columnIndex);
        const nextToLastCard = column.cards.get(-2);
        const lastCard = column.cards.last();
        const isLastCardInOrder = !nextToLastCard ||
          (colourForSuit(lastCard.suit) !== colourForSuit(nextToLastCard.suit) && lastCard.value+1 === nextToLastCard.value);
        return isLastCardInOrder ? moveableFromIndex : column.cards.size-1;
      });
  }, gameState);
  return newGameState;
};

export default function serveNewCards (gameState) {
  return pipe(
    unmarkAllCards,
    serveNewCardsToColumns
  )(gameState);
}
