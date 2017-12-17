import { min, pipe, range } from 'ramda';
import { List } from 'immutable';
import { serveCardToColumn, TOTAL_COLUMNS } from 'setup';
import unmarkAllCards from 'helpers/unmarkAllCards';

const serveNewCardsToColumns = gameState => {
  const cardsToServe = min(TOTAL_COLUMNS, gameState.get('stack').size);
  return List(range(0, cardsToServe)).reduce((memo, columnIndex) => {
    return serveCardToColumn(memo, columnIndex, true);
  }, gameState);
};

export default function serveNewCards (gameState) {
  return pipe(unmarkAllCards, serveNewCardsToColumns)(gameState);
}
