import React, { Component } from 'react';
import Pile from './Pile';

export default class Piles extends Component {
  render () {
    const { onPileCardClick, onServeNewCards, movingCoordinates, piles } = this.props;

    return (
      <div className='Piles'>
        <div className='Piles_info'>
          <h3 className='Piles_headline'>
            Discard Piles
          </h3>
          <p className='Piles_note'>
            Start discarding aces here with a double click - then twos, threes, etc.
          </p>
        </div>

        <ul className='Piles_list'>
          { piles.map((pile, index) => (
            <Pile
              key={index}
              movingCoordinates={movingCoordinates}
              onPileCardClick={onPileCardClick}
              pile={pile}
            />
          ))}
          <li>
            <button onClick={onServeNewCards}>
              Serve cards
            </button>
          </li>
        </ul>
      </div>
    );
  }
}
