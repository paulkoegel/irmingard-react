import React, { Component } from 'react';
import colourForSuit from 'helpers/colourForSuit';
import displayValueForCard from 'helpers/displayValueForCard';
import symbolForSuit from 'helpers/symbolForSuit';

export default class Card extends Component {
  labelFor (card) {
    return `${symbolForSuit(card.suit)} ${displayValueForCard(card)}`;
  }

  render () {
    const { card } = this.props;
    const { isOpen } = card;
    const className = ['Card',
      'isOpen',
      colourForSuit(card.suit),
      card.isMoving && 'isMoving'
    ].filter(e => e).join(' ');

    return (
      isOpen
        ? <li className={className}>
          <span>
            { this.labelFor(card) }
          </span>
        </li>
        : <li className='Card isClosed' />
    );
  }
}
