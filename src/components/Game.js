import './Game.css';

import React, { Component } from 'react';
import colourForSuit from 'helpers/colourForSuit';
import serveNewCards from 'helpers/serveNewCards';
import { newGameState, TOTAL_COLUMNS } from 'setup';
import Columns from './Columns';
import GameWonModal from './GameWonModal';
import Piles from './Piles';

export default class Game extends Component {
  state = {
    // "Note that state must be a plain JS object, and not an Immutable collection, because React's setState API expects an object literal and will merge it (Object.assign) with the previous state." (https://github.com/facebook/immutable-js/wiki/Immutable-as-React-state)
    gameState: this.props.gameState || newGameState()
  }

  componentDidMount () {
    window.onkeydown = this.handleKeyDown;
    window.gameState = () => this.state.gameState;
    window.history.replaceState(null, null, this.urlWithGameState(this.state.gameState));
    window.onpopstate = event => {
      window.restoreGameState(window.encodedGameStateFromUrl());
    };
    this.checkIsGameWon();
  }

  componentWillUpdate (nextProps, nextState) {
    const urlWithGameState = this.urlWithGameState(nextState.gameState);
    window.history.pushState(null, null, urlWithGameState);
  }

  updateState (updateFunction) {
    this.setState(updateFunction, this.afterStateUpdate);
  }

  afterStateUpdate () {
    this.checkIsGameWon();
  }

  urlWithGameState (gameState) {
    const encodedGameState = window.encodeGameState(gameState);
    return `/?${encodedGameState}`;
  }

  canBePlacedBelow (cardBelow, cardAbove) {
    if (!cardBelow || !cardAbove) return;
    return cardBelow.value === cardAbove.value-1 && colourForSuit(cardBelow.suit) !== colourForSuit(cardAbove.suit);
  }

  cardAt (columnOrPileIndex, cardIndex) {
    if (columnOrPileIndex <= TOTAL_COLUMNS-1) {
      return this.cardAtColumn(columnOrPileIndex, cardIndex);
    } else {
      return this.cardAtPile(columnOrPileIndex, cardIndex);
    }
  }

  cardAtColumn (columnIndex, cardIndex) {
    const column = this.state.gameState.columns.get(columnIndex);
    return column ? column.cards.get(cardIndex) : null;
  }

  cardAtPile (pileIndex, cardIndex) {
    const pile = this.state.gameState.piles.get(pileIndex - TOTAL_COLUMNS);
    return pile ? pile.cards.get(cardIndex) : null;
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

  checkIsGameWon () {
    const { gameState } = this.state;

    if (!gameState.isWon && gameState.stack.size === 0 &&
      gameState.columns.every(column =>
        [-1, 0, null].includes(column.openFromIndex) && [0, null].includes(column.moveableFromIndex)
      )) {
      this.setState(state => { // do NOT use `updateState` to prevent loop
        return {
          gameState: gameState.merge({
            isWon: true
          })
        };
      });
    }
  }

  discardToPile (columnIndex, cardIndex) {
    this.updateState(state => {
      const gameState = state.gameState;
      const cardToDiscard = gameState.columns.get(columnIndex).cards.get(cardIndex);
      const targetPileIndex = this.freePileFor(cardToDiscard).index;

      return {
        gameState: gameState
          .updateIn(['piles', targetPileIndex, 'cards'], cards => cards.push(cardToDiscard))
          .updateIn(['columns', columnIndex, 'cards'], cards => cards.pop())
          .updateIn(['columns', columnIndex], column => column.merge({
            moveableFromIndex: this.calculateMoveableFromIndex(column),
            openFromIndex: column.openFromIndex === 0
              ? null
              : column.openFromIndex >= column.cards.size ? column.openFromIndex - 1 : column.openFromIndex
          }))
      };
    });
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
    const { markedCardCoordinates: [previousColumnOrPileIndex, previousCardIndex] } = this.state.gameState;
    // double click
    if (columnIndex === previousColumnOrPileIndex && cardIndex === previousCardIndex) {
      if (this.isDiscardable(columnIndex, cardIndex)) {
        this.discardToPile(columnIndex, cardIndex);
      } else {
        this.updateState(state => (
          {
            gameState: state.gameState.merge({
              markedCardCoordinates: []
            })
          }
        ));
      }
    } else { // single click
      if (previousColumnOrPileIndex !== undefined && previousCardIndex !== undefined) { // try to move previously marked cards below the currently marked one; 0 is falsy...
        const cardToMove = this.cardAt(previousColumnOrPileIndex, previousCardIndex);
        if (this.canBePlacedBelow(cardToMove, this.cardAt(columnIndex, cardIndex))) {
          // TODO: can we unify this and remove the `if` distinguishing comlum-column from pile-column moves?
          // move card from column to column
          if (previousColumnOrPileIndex <= TOTAL_COLUMNS-1) {
            this.updateState(state => {
              const { gameState } = state;
              const cardsToMove = gameState.columns.get(previousColumnOrPileIndex).cards.splice(0, previousCardIndex);
              return {
                gameState: gameState
                  .merge({
                    markedCardCoordinates: []
                  })
                  .updateIn(['columns', previousColumnOrPileIndex, 'cards'], cards => cards.splice(previousCardIndex))
                  .updateIn(['columns', previousColumnOrPileIndex], column =>
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
          } else { // move card from pile to column
            this.updateState(state => {
              return {
                gameState: state.gameState
                  .merge({
                    markedCardCoordinates: []
                  })
                  .updateIn(['piles', (previousColumnOrPileIndex-TOTAL_COLUMNS), 'cards'], cards => cards.pop())
                  .updateIn(['columns', columnIndex, 'cards'], cards =>
                    cards.push(cardToMove))
              };
            });
          }
        } else {
          this.updateState(state => (
            {
              gameState: state.gameState.merge({
                markedCardCoordinates: [columnIndex, cardIndex]
              })
            }
          ));
        }
      } else { // no marked cards -  mark this one and its children
        this.updateState(state => (
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
    if (markedColIndex > TOTAL_COLUMNS-1) return; // when card in pile is selected

    const markedCard = this.cardAt(markedColIndex, markedCardIndex);
    const markedColumnCards = gameState.columns.get(markedColIndex).cards;
    const markedCardWithChildren = markedColumnCards.slice(markedCardIndex, markedColumnCards.size);

    if (markedCard && markedCard.value === 13) { // king
      this.updateState(state => {
        const { gameState } = state;
        return {
          gameState: gameState
            .updateIn(['columns', markedColIndex, 'cards'], cards => cards.slice(0, markedCardIndex)) // TODO: move this and the next updateIn to function `removeLastCardFromColumn(columnIndex, gameState)`
            .updateIn(['columns', markedColIndex], column => column.merge({
              moveableFromIndex: this.calculateMoveableFromIndex(column),
              openFromIndex: column.openFromIndex === 0
                ? null
                : column.openFromIndex >= column.cards.size ? column.openFromIndex - 1 : column.openFromIndex
            }))
            .updateIn(['columns', clickedColumnIndex, 'cards'], cards => cards.concat(markedCardWithChildren))
            .updateIn(['columns', clickedColumnIndex], column => column.merge({
              moveabeFromIndex: 0,
              openFromIndex: 0
            }))
        };
      });
    }
  }

  handlePileCardClick = (pileIndex, cardIndex) => {
    this.updateState(state => (
      {
        gameState: state.gameState.merge({
          markedCardCoordinates: [TOTAL_COLUMNS + pileIndex, cardIndex]
        })
      }
    ));
  }

  handleServeNewCards = () => {
    if (this.state.gameState.stack.size > 0) {
      this.updateState(state => (
        {
          gameState: serveNewCards(state.gameState)
        }
      ));
    }
  }

  isKing (card) {
    return card.value === 13;
  }

  render () {
    const { gameState } = this.state;
    const markedCard = this.cardAt(...gameState.markedCardCoordinates);
    const className = [
      'Game',
      markedCard && this.isKing(markedCard) && 'isMovingKing'
    ].filter(e => e).join(' ');

    return (
      <div className={className}>
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
        {gameState.isWon && <GameWonModal />}
      </div>
    );
  }
}
