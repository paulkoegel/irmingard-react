import { fromJS, List, Map } from 'immutable';
import { chain, range } from 'ramda'; // Immutable's Range is lazy and has given me nothing but pain in `updateIn` calls
import immutableShuffle from './helpers/shuffle';

const TOTAL_COLUMNS = 9;
const SUITS = List.of(
  'clubs',
  'diamonds',
  'hearts',
  'spades'
);
const DOUBLE_SUITS = fromJS(chain(suit => [suit, suit], SUITS));

const makeCardsForSuit = suit => {
  return fromJS(chain(
    value => [
      {
        deck: 'a',
        suit,
        value
      },
      {
        deck: 'b',
        suit,
        value
      }
    ],
    range(1, 14)
  ));
};

const shuffledStack = () => {
  const stack = List(chain(makeCardsForSuit, SUITS));
  return immutableShuffle(stack);
};

const makeColumns = () => {
  return List(range(0, TOTAL_COLUMNS)).map(columnIndex =>
    Map({ cards: List(), index: columnIndex })
  );
};

const makePiles = () => {
  return DOUBLE_SUITS.map((suit, index) => {
    return ({
      cards: List(),
      index,
      suit
    });
  });
};

const serveCardToColumn = (gameState, columnIndex, isOpen=false) => {
  const card = gameState.get('stack').last().merge({ isOpen });
  if (card) {
    return gameState.updateIn(['stack'], stack => stack.pop())
      .updateIn(['columns', columnIndex, 'cards'], cards => cards.push(card));
  } else {
    return gameState;
  }
};

const serveCardsToColumn = (gameState, columnIndex, cardsToServe) => {
  return range(0, cardsToServe).reduce((m, e) => {
    return serveCardToColumn(m, columnIndex, e === cardsToServe-1);
  },
  gameState);
};

export const serveCards = gameState => {
  console.log('stack before:', gameState.getIn(['stack']).size);
  const indexedCardCounts = [1, 2, 3, 4, 5, 4, 3, 2, 1].map((cardCount, index) => [cardCount, index]);
  return indexedCardCounts.reduce((m, [cardCount, index]) => {
    const x = serveCardsToColumn(m, index, cardCount);
    console.log('stack AFTER:', x.getIn(['stack']).size);
    return x;
  }, gameState);
};

export const initialGameState = Map({
  columns: makeColumns(),
  piles: makePiles(),
  stack: shuffledStack()
});
