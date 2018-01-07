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

  childrenOf (columnIndex, cardIndex) {
    const { gameState } = this.state;
    return gameState.columns.get(columnIndex).cards.skipUntil((e, i) => i > cardIndex);
  }

  cardAt (columnIndex, cardIndex) {
    return this.state.gameState.columns.get(columnIndex).cards.get(cardIndex);
  }

  checkMoveableFromIndex (column) {
    const cards = column.cards;

    if (cards.size === 0) {
      return null;
    } else if (cards.size === 1) {
      return 0;
    } else {
      let numberOfMoveableCards = 0;

      for (let i = cards.size-1; i >= 0; i--) {
        const card = cards.get(i);
        const cardAbove = cards.get(i-1);
        if (card.value === cardAbove.value-1 && colourForSuit(card.suit) !== colourForSuit(cardAbove.suit)) {
          numberOfMoveableCards++;
        } else {
          break;
        }
      }

      const moveableFromIndex = (cards.size - 1) - numberOfMoveableCards;
      return moveableFromIndex;
    }
  }

  checkOpen = (columnIndex, cardIndex) => {
    const column = this.state.gameState.columns.get(columnIndex);
    return cardIndex >= column.openFromIndex;
  }

  discardToPile (columnIndex, cardIndex) {
    const gameState = this.state.gameState;
    const card = gameState.columns.get(columnIndex).cards.get(cardIndex);
    const pileIndex = this.freePileFor(card).index;

    this.setState(state => ({
      gameState: gameState
        .updateIn(['piles', pileIndex, 'cards'], cards => cards.push(card))
        .updateIn(['columns', columnIndex, 'cards'], cards => cards.pop())
        .updateIn(['columns', columnIndex], column => column.merge({
          moveableFromIndex: this.checkMoveableFromIndex(column),
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
    if (columnIndex === previousColumnIndex && cardIndex === previousCardIndex) {
      if (this.isDiscardable(columnIndex, cardIndex)) {
        this.discardToPile(columnIndex, cardIndex);
      } else {
        this.setState(state => (
          {
            gameState: state.gameState.merge({
              movingCoordinates: []
            })
          }));
      }
    } else {
      // mark new card & its potential children
      this.setState(state => (
        {
          gameState: state.gameState.merge({
            movingCoordinates: [columnIndex, cardIndex]
          })
        }));
    }
  }

  handleKeyDown = event => {
    // 'enter' key
    if (event.keyCode === 13) {
      this.handleServeNewCards();
    }
  }

  handlePileCardClick = (pileIndex, _cardIndex) => {
    const cardIndex = this.state.gameState.piles.get(pileIndex).cards.size-1;
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
