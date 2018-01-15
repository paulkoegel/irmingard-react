import React, { Component } from 'react';
import Columns from 'components/Columns';
import './Game.css';
import Piles from 'components/Piles';
import colourForSuit from 'helpers/colourForSuit';
import serveNewCards from 'helpers/serveNewCards';
import { newGameState, TOTAL_COLUMNS } from 'setup';

export default class Game extends Component {
  state = {
    // "Note that state must be a plain JS object, and not an Immutable collection, because React's setState API expects an object literal and will merge it (Object.assign) with the previous state." (https://github.com/facebook/immutable-js/wiki/Immutable-as-React-state)
    gameState: this.props.gameState || newGameState()
  }

  componentDidMount () {
    window.onkeydown = this.handleKeyDown;
    window.gameState = () => this.state.gameState;
  }

  canBePlacedBelow (cardBelow, cardAbove) {
    if (!cardBelow || !cardAbove) return;
    return cardBelow.value === cardAbove.value-1 && colourForSuit(cardBelow.suit) !== colourForSuit(cardAbove.suit);
  }

  cardAt (columnIndex, cardIndex) {
    return this.state.gameState.columns.get(columnIndex).cards.get(cardIndex);
  }

  childrenOf (columnIndex, cardIndex) {
    const { gameState } = this.state;
    return gameState.columns.get(columnIndex).cards.skipUntil((e, i) => i > cardIndex);
  }

  calculateMoveableFromIndex (column) {
    // TODO: must respect openFromIndex!
    const cards = column.cards;
    const openCardsCount = cards.size - column.openFromIndex;

    if (cards.size === 0) {
      return null;
    } else if (openCardsCount === 1) { // last card is always moveable; can be below closed cards
      return column.openFromIndex;
    } else {
      let numberOfMoveableCards = 1;

      for (let i = cards.size-1; i >= cards.size - openCardsCount; i--) {
        const card = cards.get(i);
        const cardAbove = cards.get(i-1);
        console.log(card.toJS(), cardAbove.toJS(), this.canBePlacedBelow(card, cardAbove));
        if (this.canBePlacedBelow(card, cardAbove)) {
          console.log('canBePlacedBelow');
          numberOfMoveableCards++;
        } else {
          console.log('break');
          break;
        }
      }
      console.log(cards.size, openCardsCount, numberOfMoveableCards, cards.size-1-numberOfMoveableCards);

      const moveableFromIndex = cards.size - numberOfMoveableCards;
      return moveableFromIndex;
    }
  }

  checkOpen = (columnIndex, cardIndex) => {
    const column = this.state.gameState.columns.get(columnIndex);
    return cardIndex >= column.openFromIndex;
  }

  discardToPile (columnIndex, cardIndex) {
    const gameState = this.state.gameState;
    const cardToDiscard = gameState.columns.get(columnIndex).cards.get(cardIndex);
    const targetPileIndex = this.freePileFor(cardToDiscard).index;

    this.setState(state => ({
      gameState: gameState
        .updateIn(['piles', targetPileIndex, 'cards'], cards => cards.push(cardToDiscard))
        .updateIn(['columns', columnIndex, 'cards'], cards => cards.pop())
        .updateIn(['columns', columnIndex], column => column.merge({
          moveableFromIndex: this.calculateMoveableFromIndex(column),
          openFromIndex: column.openFromIndex === 0
            ? null
            : column.openFromIndex >= column.cards.size ? column.openFromIndex - 1 : column.openFromIndex
        }))
    }));
  }

  freePileFor (card) {
    return this.state.gameState.piles.find(pile => {
      return pile.suit === card.suit && pile.cards.size === card.value-1;
    });
  }

  isDiscardable (columnIndex, cardIndex) {
    const column = this.state.gameState.columns.get(columnIndex);
    const isLastCardOfColumn = cardIndex === column.cards.size-1;

    const card = column.cards.get(cardIndex);
    const pile = this.freePileFor(card);

    return isLastCardOfColumn && pile;
  }

  handleColumnCardClick = (columnIndex, cardIndex) => {
    const { movingCoordinates: [previousColumnIndex, previousCardIndex] } = this.state.gameState;
    console.log(this.state.gameState.movingCoordinates, previousColumnIndex, previousCardIndex);
    // double click
    if (columnIndex === previousColumnIndex && cardIndex === previousCardIndex) {
      if (this.isDiscardable(columnIndex, cardIndex)) {
        this.discardToPile(columnIndex, cardIndex);
      } else {
        this.setState(state => (
          {
            gameState: state.gameState.merge({
              movingCoordinates: []
            })
          }
        ));
      }
    } else { // single click
      console.log('single click');
      if (previousColumnIndex !== undefined && previousCardIndex !== undefined) { // try to move previously marked cards below the currently marked one; 0 is falsy...
        if (this.canBePlacedBelow(this.cardAt(previousColumnIndex, previousCardIndex), this.cardAt(columnIndex, cardIndex))) {
          // DONE - move marked cards to target
          // DONE - unmark all cards
          this.setState(state => {
            const cardsToMove = state.gameState.columns.get(previousColumnIndex).cards.splice(0, previousCardIndex);
            return {
              gameState: state.gameState
                .merge({
                  movingCoordinates: []
                })
                .updateIn(['columns', previousColumnIndex, 'cards'], cards => cards.splice(previousCardIndex))
                .updateIn(['columns', previousColumnIndex], column =>
                  column.merge({
                    moveableFromIndex: this.calculateMoveableFromIndex(column),
                    openFromIndex: column.openFromIndex === 0
                      ? null
                      : column.openFromIndex >= column.cards.size ? column.openFromIndex - 1 : column.openFromIndex
                  })
                )
                .updateIn(['columns', columnIndex, 'cards'], cards =>
                  cards.concat(cardsToMove))
            };
          });
        } else {
          this.setState(state => (
            {
              gameState: state.gameState.merge({
                movingCoordinates: [columnIndex, cardIndex]
              })
            }
          ));
        }
      } else { // no marked cards -  mark this one and its children
        this.setState(state => (
          {
            gameState: state.gameState.merge({
              movingCoordinates: [columnIndex, cardIndex]
            })
          }));
      }
    }
  }

  handleKeyDown = event => {
    // 'enter' key
    if (event.keyCode === 13) {
      this.handleServeNewCards();
    }
  }

  handlePileCardClick = (pileIndex, cardIndex) => {
    this.setState(state => (
      {
        gameState: state.gameState.merge({
          movingCoordinates: [TOTAL_COLUMNS + pileIndex, cardIndex]
        })
      }
    ));
  }

  handleServeNewCards = () => {
    if (this.state.gameState.stack.size > 0) {
      this.setState(state => (
        {
          gameState: serveNewCards(state.gameState)
        }
      ));
    }
  }

  render () {
    const { gameState } = this.state;

    return (
      <div className='Game'>
        <p style={{ fontSize: 5, wordWrap: 'break-word', height: 40 }}>
          {window.encodeGameState(this.state.gameState)}
        </p>
        <Piles
          hasCardsOnStack={gameState.stack.size > 0}
          movingCoordinates={gameState.movingCoordinates}
          onPileCardClick={this.handlePileCardClick}
          onServeNewCards={this.handleServeNewCards}
          piles={gameState.piles}
        />
        <Columns
          checkOpen={this.checkOpen}
          columns={gameState.columns}
          onColumnCardClick={this.handleColumnCardClick}
          movingCoordinates={gameState.movingCoordinates}
        />
      </div>
    );
  }
}
