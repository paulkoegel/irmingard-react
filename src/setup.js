import { fromJS, List, Record } from 'immutable';
import { chain as flatMap, range } from 'ramda'; // Immutable's Range is lazy and gives nothing but pain in `updateIn` calls
import immutableShuffle from './helpers/shuffle';

export const TOTAL_COLUMNS = 9;
const SUITS = List.of(
  'clubs',
  'diamonds',
  'hearts',
  'spades'
);
const DOUBLE_SUITS = fromJS(flatMap(suit => [suit, suit], SUITS));

const CardRecord = Record({
  deck: null,
  isOpen: false,
  suit: null,
  value: null
});

const makeCardsForSuit = suit => {
  return List(flatMap(
    value => [
      new CardRecord({
        deck: 'a',
        suit,
        value
      }),
      new CardRecord({
        deck: 'b',
        suit,
        value
      })
    ],
    range(1, 14)
  ));
};

const makeShuffledStack = () => {
  const stack = List(flatMap(makeCardsForSuit, SUITS));
  return immutableShuffle(stack);
};

const ColumnRecord = Record({
  cards: List(),
  index: null
});

const makeColumns = () => {
  return List(range(0, TOTAL_COLUMNS)).map(columnIndex =>
    new ColumnRecord({ index: columnIndex })
  );
};

const PileRecord = Record({
  cards: List(),
  index: null,
  suit: null
});

const makePiles = () => {
  return DOUBLE_SUITS.map((suit, index) => {
    return new PileRecord({
      index,
      suit
    });
  });
};

export const serveCardToColumn = (gameState, columnIndex, isOpen=false) => {
  const card = gameState.stack.last().merge({ isOpen });
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

const serveCards = gameState => {
  const indexedCardCounts = [1, 2, 3, 4, 5, 4, 3, 2, 1].map((cardCount, index) => [cardCount, index]);
  return indexedCardCounts.reduce((m, [cardCount, index]) => {
    return serveCardsToColumn(m, index, cardCount);
  }, gameState);
};

const GameStateRecord = Record({
  columns: null,
  piles: null,
  stack: null
});

const initialGameState = new GameStateRecord({
  columns: makeColumns(),
  piles: makePiles(),
  stack: makeShuffledStack()
});

export const newGameState = () => serveCards(initialGameState);
