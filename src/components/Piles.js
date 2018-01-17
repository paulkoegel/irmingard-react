import React, { Component } from 'react';
import Pile from './Pile';

export default class Piles extends Component {
  startNewGame () {
    if (window.confirm('Start a new game - are you sure?')) {
      window.location.href = window.location.origin;
    }
  }
  render () {
    const { hasCardsOnStack, onPileCardClick, onServeNewCards, markedCardCoordinates, piles } = this.props;

    return (
      <div className='Piles'>
        <div className='Piles_infoBar'>
          <h3 className='Piles_headline'>
            Discard Piles
          </h3>
          <p className='Piles_note'>
            Start discarding aces here with a double click - then twos, threes, etc.
          </p>
          <button
            className='Piles_newGame'
            onClick={this.startNewGame}>
            New game
          </button>
        </div>

        <ul className='Piles_list'>
          { piles.map((pile, index) => (
            <Pile
              key={index}
              markedCardCoordinates={markedCardCoordinates}
              onPileCardClick={onPileCardClick}
              pile={pile}
            />
          ))}
          <li className='Pile_serveCardsWrapper'>
            <button
              className='Piles_serveCards'
              disabled={!hasCardsOnStack}
              onClick={onServeNewCards}>
              Serve cards
            </button>
          </li>
        </ul>
      </div>
    );
  }
}
