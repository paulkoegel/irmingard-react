import React, { Component } from 'react';
import Pile from './Pile';

export default class Piles extends Component {
  render () {
    const { onServeNewCards } = this.props;

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
          { this.props.piles.map((pile, index) => {
            return <Pile index={index} key={index} pile={pile} />;
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
