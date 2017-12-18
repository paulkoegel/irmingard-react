import React, { Component } from 'react';
import Card from './Card';

export default class Column extends Component {
  idFor (card) {
    const { deck, suit, value } = card;
    return [deck, suit, value].join('.');
  }

  render () {
    const { column, onCardClick } = this.props;

    return (
      <li className='Column'>
        <ul className='Column_cards'>
          { column.cards.map((card, index) =>
            <Card
              card={card}
              cardIndex={index}
              columnIndex={column.index}
              key={this.idFor(card)}
              onClick={onCardClick}
            />
          )}
        </ul>
      </li>
    );
  }
}
