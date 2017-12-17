import './Game.css';
import React, { Component } from 'react';
// import { is } from 'immutable';
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

  handleKeyDown = event => {
    // 13 is the 'enter' key
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
        <Columns columns={gameState.get('columns')} />
        <Piles onServeNewCards={this.handleServeNewCards} piles={gameState.get('piles')} />
      </div>
    );
  }
}
