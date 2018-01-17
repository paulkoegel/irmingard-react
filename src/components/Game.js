import React, { Component } from 'react';
import Columns from 'components/Columns';
import './Game.css';
import Piles from 'components/Piles';
import colourForSuit from 'helpers/colourForSuit';
import serveNewCards from 'helpers/serveNewCards';
import { newGameState, TOTAL_COLUMNS } from 'setup';

let historyCounter = 1;

export default class Game extends Component {
  state = {
    // "Note that state must be a plain JS object, and not an Immutable collection, because React's setState API expects an object literal and will merge it (Object.assign) with the previous state." (https://github.com/facebook/immutable-js/wiki/Immutable-as-React-state)
    gameState: this.props.gameState || newGameState()
  }

  componentDidMount () {
    window.onkeydown = this.handleKeyDown;
    window.gameState = () => this.state.gameState;
    window.history.replaceState(null, null, this.urlWithGameState(this.state.gameState));
  }

  componentWillUpdate (nextProps, nextState) {
    const urlWithGameState = this.urlWithGameState(nextState.gameState);
    console.log(historyCounter++, urlWithGameState);
    window.history.pushState(null, null, urlWithGameState);
  }

  urlWithGameState (gameState) {
    const encodedGameState = window.encodeGameState(gameState);
    return `${window.location.origin}/?${encodedGameState}`;
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
        if (this.canBePlacedBelow(card, cardAbove)) {
          numberOfMoveableCards++;
        } else {
          break;
        }
      }

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
    const { markedCardCoordinates: [previousColumnIndex, previousCardIndex] } = this.state.gameState;
    // double click
    if (columnIndex === previousColumnIndex && cardIndex === previousCardIndex) {
      if (this.isDiscardable(columnIndex, cardIndex)) {
        this.discardToPile(columnIndex, cardIndex);
      } else {
        this.setState(state => (
          {
            gameState: state.gameState.merge({
              markedCardCoordinates: []
            })
          }
        ));
      }
    } else { // single click
      if (previousColumnIndex !== undefined && previousCardIndex !== undefined) { // try to move previously marked cards below the currently marked one; 0 is falsy...
        if (this.canBePlacedBelow(this.cardAt(previousColumnIndex, previousCardIndex), this.cardAt(columnIndex, cardIndex))) {
          // DONE - move marked cards to target
          // DONE - unmark all cards
          this.setState(state => {
            const cardsToMove = state.gameState.columns.get(previousColumnIndex).cards.splice(0, previousCardIndex);
            return {
              gameState: state.gameState
                .merge({
                  markedCardCoordinates: []
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
                markedCardCoordinates: [columnIndex, cardIndex]
              })
            }
          ));
        }
      } else { // no marked cards -  mark this one and its children
        this.setState(state => (
          {
            gameState: state.gameState.merge({
              markedCardCoordinates: [columnIndex, cardIndex]
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

  handleColumnPlaceholderClick = clickedColumnIndex => () => {
    const { gameState } = this.state;
    const [ markedColIndex, markedCardIndex ] = gameState.markedCardCoordinates;
    const markedCard = this.cardAt(markedColIndex, markedCardIndex);

    if (markedCard.value === 13) { // king
      this.setState({
        gameState: gameState
          .updateIn(['columns', markedColIndex, 'cards'], cards => cards.pop()) // TODO: move this and the next updateIn to function `removeLastCardFromColumn(columnIndex, gameState)`
          .updateIn(['columns', markedColIndex], column => column.merge({
            moveableFromIndex: this.calculateMoveableFromIndex(column),
            openFromIndex: column.openFromIndex === 0
              ? null
              : column.openFromIndex >= column.cards.size ? column.openFromIndex - 1 : column.openFromIndex
          }))
          .updateIn(['columns', clickedColumnIndex, 'cards'], cards => cards.push(markedCard))
          .updateIn(['columns', clickedColumnIndex], column => column.merge({
            moveabeFromIndex: 0,
            openFromIndex: 0
          }))
      });
    }
  }

  handlePileCardClick = (pileIndex, cardIndex) => {
    this.setState(state => (
      {
        gameState: state.gameState.merge({
          markedCardCoordinates: [TOTAL_COLUMNS + pileIndex, cardIndex]
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
        <Piles
          hasCardsOnStack={gameState.stack.size > 0}
          markedCardCoordinates={gameState.markedCardCoordinates}
          onPileCardClick={this.handlePileCardClick}
          onServeNewCards={this.handleServeNewCards}
          piles={gameState.piles}
        />
        <Columns
          checkOpen={this.checkOpen}
          columns={gameState.columns}
          markedCardCoordinates={gameState.markedCardCoordinates}
          onColumnCardClick={this.handleColumnCardClick}
          onPlaceholderClick={this.handleColumnPlaceholderClick}
        />
      </div>
    );
  }
}
