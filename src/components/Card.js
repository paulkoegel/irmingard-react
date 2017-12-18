import React, { Component } from 'react';
import colourForSuit from 'helpers/colourForSuit';
import displayValueForCard from 'helpers/displayValueForCard';
import symbolForSuit from 'helpers/symbolForSuit';

export default class Card extends Component {
  labelFor (card) {
    return `${symbolForSuit(card.suit)} ${displayValueForCard(card)}`;
  }

  render () {
    const { card, cardIndex, columnIndex, onClick } = this.props;
    const { isMoving, isOpen, suit } = card;
    const className = ['Card',
      'isOpen',
      colourForSuit(suit),
      isMoving && 'isMoving'
    ].filter(e => e).join(' ');

    return (
      isOpen
        ? (
          <li className={className} onClick={() => { onClick(cardIndex, columnIndex); }}>
            <span>
              { this.labelFor(card) }
            </span>
          </li>
        )
        : <li className='Card isClosed' />
    );
  }
}
