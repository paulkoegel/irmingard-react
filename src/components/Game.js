import './Game.css';
import React, { Component } from 'react';
import { isEmpty, range } from 'ramda';
import { is, List } from 'immutable';
import Columns from 'components/Columns';
import Piles from 'components/Piles';
import serveNewCards from 'helpers/serveNewCards';
import { newGameState } from 'setup';
import colourForSuit from 'helpers/colourForSuit';

export default class Game extends Component {
  state = {
    // "Note that state must be a plain JS object, and not an Immutable collection, because React's setState API expects an object literal and will merge it (Object.assign) with the previous state." (https://github.com/facebook/immutable-js/wiki/Immutable-as-React-state)
    gameState: newGameState()
  };

  componentDidMount () {
    window.onkeydown = this.handleKeyDown;
  }

  childrenOf (columnIndex, cardIndex) {
    const { gameState } = this.state;
    return gameState.columns.get(columnIndex).cards.skipUntil((e, i) => i > cardIndex);
  }

  // Takes a List of cards and checks whether they have alternating colours (..,red,black,red,black,..)
  haveAlternatingColours (cards) {
    const colours = cards.map(card => colourForSuit(card.suit));
    let isAlternating = true;
    let previousColour = colours.first();
    colours.rest().forEach(colour => {
      isAlternating = isAlternating && colour !== previousColour;
      previousColour = colour;
    });
    return isAlternating;
  }

  // Checks whether a vector of cards is ordered by the cards' values and has no gaps.
  haveDescendingValues (cards) {
    const values = cards.map(card => card.value);
    const firstValue = cards.first().value;
    const lastValue = cards.last().value;
    return is(values, List(range(lastValue, firstValue + 1)).reverse());
  }

  // Takes a column and a card and checks whether the card and its children are sorted (i.e. with alternating colours and descending values)."
  hasMoveableChildren (columnIndex, cardIndex) {
    const children = this.childrenOf(columnIndex, cardIndex);

    if (isEmpty(children)) {
      return true; // the last card of the column is always moveable
    } else {
      const card = this.cardAt(columnIndex, cardIndex);
      const cards = List.of(card, ...children);
      return this.haveDescendingValues(cards) && this.haveAlternatingColours(cards);
    }
  }

  cardAt (columnIndex, cardIndex) {
    return this.state.gameState.columns.get(columnIndex).cards.get(cardIndex);
  }

  checkMoveable = (columnIndex, cardIndex) => {
    const card = this.cardAt(columnIndex, cardIndex);
    if (!card) throw new Error(`isMoveable: cardIndex (${cardIndex}) is out of bounds for column number ${columnIndex}. Card is: ${JSON.stringify(card.toJS())}`);

    console.log('isMoveable?', card.isOpen && this.hasMoveableChildren(columnIndex, cardIndex), columnIndex, 'x', cardIndex);
    return card.isOpen && this.hasMoveableChildren(columnIndex, cardIndex);
  }

  handleColumnCardClick = (cardIndex, columnIndex) => {
    this.checkMoveable(columnIndex, cardIndex);
  }

  handleKeyDown = event => {
    // 'enter' key
    if (event.keyCode === 13) {
      this.handleServeNewCards();
    }
  };

  handleServeNewCards = () => {
    this.setState(state => ({ gameState: serveNewCards(state.gameState) }));
  };

  render () {
    const { gameState } = this.state;

    return (
      <div className='Game'>
        <Columns
          checkMoveable={this.checkMoveable}
          columns={gameState.columns}
          onCardClick={this.handleColumnCardClick}
        />
        <Piles onServeNewCards={this.handleServeNewCards} piles={gameState.piles} />
      </div>
    );
  }
}
