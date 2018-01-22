import { fromJS, is, List, Record } from 'immutable';
import { chain as flatMap, range } from 'ramda'; // Immutable's Range is lazy and gives nothing but pain in `updateIn` calls
import immutableShuffle from './helpers/shuffle';

// constants
export const TOTAL_COLUMNS = 9;
const SUITS = List.of(
  'hearts',
  'diamonds',
  'spades',
  'clubs'
);
const DOUBLE_SUITS = fromJS(flatMap(suit => [suit, suit], SUITS));
const INITIAL_CARD_COUNTS_PER_COLUMN = [1, 2, 3, 4, 5, 4, 3, 2, 1];

export const CardRecord = Record({
  deck: null,
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

export const ColumnRecord = Record({
  cards: List(),
  index: null,
  moveableFromIndex: 0,
  openFromIndex: 0
});

const makeColumns = () => {
  return List(range(0, TOTAL_COLUMNS)).map(columnIndex =>
    new ColumnRecord({ index: columnIndex })
  );
};

export const PileRecord = Record({
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

export const serveCardToColumn = (gameState, columnIndex) => {
  const card = gameState.stack.last();
  if (card) {
    return gameState
      .updateIn(['stack'], stack => stack.pop())
      .updateIn(['columns', columnIndex, 'cards'], cards => cards.push(card));
  } else {
    return gameState;
  }
};

const serveInitialCardsToColumn = (gameState, columnIndex, cardCountToServe) => {
  const newGameState = range(0, cardCountToServe).reduce((m, e) => {
    return serveCardToColumn(m, columnIndex);
  },
  gameState);
  return newGameState
    .updateIn(['columns', columnIndex, 'moveableFromIndex'], _ => cardCountToServe-1)
    .updateIn(['columns', columnIndex, 'openFromIndex'], _ => cardCountToServe-1);
};

const serveCards = gameState => {
  return INITIAL_CARD_COUNTS_PER_COLUMN.reduce((memo, cardCount, index) => {
    return serveInitialCardsToColumn(memo, index, cardCount);
  }, gameState);
};

export const GameStateRecord = Record({
  columns: null,
  markedCardCoordinates: [],
  piles: null,
  stack: null
});

const initialGameState = new GameStateRecord({
  columns: makeColumns(),
  piles: makePiles(),
  stack: makeShuffledStack()
});

// special preparation steps to make a successful game more likely:
// + always start with one random discarded ace
const specialPrepare = (gameState) => {
  const randomAce = new CardRecord({
    deck: 'a',
    suit: immutableShuffle(SUITS).first(),
    value: 1
  });

  return gameState
    .updateIn(['stack'], stack => stack.filter(card => !is(card, randomAce)))
    .updateIn(['piles'], piles => {
      const pile = piles.find(pile => pile.suit === randomAce.suit);
      return piles.updateIn([pile.index], pile => pile.merge({ cards: pile.cards.push(randomAce) }));
    });
};

export const newGameState = () => serveCards(specialPrepare(initialGameState));
