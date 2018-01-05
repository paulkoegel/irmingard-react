import './Game.css';
import React, { Component } from 'react';
import Columns from 'components/Columns';
import Piles from 'components/Piles';
import serveNewCards from 'helpers/serveNewCards';
import { newGameState } from 'setup';

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

  cardAt (columnIndex, cardIndex) {
    return this.state.gameState.columns.get(columnIndex).cards.get(cardIndex);
  }

  checkOpen = (columnIndex, cardIndex) => {
    const column = this.state.gameState.columns.get(columnIndex);
    return cardIndex >= column.openFromIndex;
  }

  handleColumnCardClick = (columnIndex, cardIndex) => {
    this.setState(state => (
      {
        gameState: state.gameState.merge({
          movingCoordinates: [columnIndex, cardIndex]
        })
      }));
  }

  handleKeyDown = event => {
    // 'enter' key
    if (event.keyCode === 13) {
      this.handleServeNewCards();
    }
  };

  handleServeNewCards = () => {
    this.setState(state => (
      {
        gameState: serveNewCards(state.gameState)
      }));
  };

  render () {
    const { gameState } = this.state;

    return (
      <div className='Game'>
        <Piles
          onServeNewCards={this.handleServeNewCards}
          piles={gameState.piles}
        />
        <Columns
          checkOpen={this.checkOpen}
          columns={gameState.columns}
          onCardClick={this.handleColumnCardClick}
          movingCoordinates={gameState.movingCoordinates}
        />
      </div>
    );
  }
}
