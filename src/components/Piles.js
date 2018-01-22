import React, { Component } from 'react';
import Pile from './Pile';

export default class Piles extends Component {
  startNewGame () {
    if (window.confirm('Start a new game - are you sure?')) {
      window.location.href = window.location.origin;
    }
  }
  render () {
    const { hasCardsOnStack, markedCardCoordinates, onPileCardClick, onServeNewCards, piles } = this.props;

    return (
      <div className='Piles'>
        <div className='Piles_metaBar'>
          <div className='Piles_info'>
            <h3 className='Piles_headline'>
              Irmingard
            </h3>
            <p className='Piles_note'>
              { /* Start discarding aces here with a double click - then twos, threes, etc. */ }
            </p>
          </div>
          <div className='Piles_buttons'>
            <button
              className='Piles_undo'
              onClick={() => window.history.back()}>
              <span className='Piles_backArrow'>&#10554;</span>
              Zurück
            </button>
            <button
              className='Piles_newGame'
              onClick={this.startNewGame}>
              Neues Spiel
            </button>
          </div>
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
              Neue Karten
            </button>
          </li>
        </ul>
      </div>
    );
  }
}
