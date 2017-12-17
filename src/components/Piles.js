import React, { Component } from 'react';
import Pile from './Pile';

export default class Piles extends Component {
  render () {
    const { onServeNewCards } = this.props;

    return (
      <div className='Piles'>
        <div>
          <h3 className='Piles_headline'>
            Discard Piles
          </h3>
          <span className='Piles_note'>
            Start discarding aces here with a double click - then twos, threes, etc.
          </span>
        </div>
        <ul>
          { this.props.piles.map((pile, index) => {
            return <Pile key={index} pile={pile} />;
          })}
          <li>
            <button onClick={() => onServeNewCards()}>
              Serve cards
            </button>
          </li>
        </ul>
      </div>
    );
  }
}
