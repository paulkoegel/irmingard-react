import { List, Map } from 'immutable';
import { chain, range } from 'ramda';
import shuffle from './helpers/shuffle';

export const TOTAL_COLUMNS = 9;
export const SUITS = List.of(
  'clubs',
  'diamonds',
  'hearts',
  'spades'
);
export const DOUBLE_SUITS = chain(suit => List.of(suit, suit), SUITS);

export const makeCardsForSuit = suit => {
  return List(chain(
    value => List.of(
      Map({
        deck: 'a',
        suit,
        value
      }),
      Map({
        deck: 'b',
        suit,
        value
      })
    ),
    List(range(1, 14))
  ));
};

export const shuffledStack = () => {
  const stack = List(chain(makeCardsForSuit, SUITS));
  return shuffle(stack);
};
