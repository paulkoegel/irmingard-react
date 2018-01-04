import React, { Component } from 'react';
import colourForSuit from 'helpers/colourForSuit';
import displayValueForCard from 'helpers/displayValueForCard';
import symbolForSuit from 'helpers/symbolForSuit';

export default class Card extends Component {
  labelFor (card) {
    return `${symbolForSuit(card.suit)} ${displayValueForCard(card)}`;
  }

  render () {
    const { card, cardIndex, columnIndex, isMoveable, isOpen, onClick } = this.props;
    const { isMoving, suit } = card;
    const wrapperClassNames = ['Card',
      colourForSuit(suit),
      isMoving && 'isMoving',
      isMoveable && 'isMoveable',
      'isOpen'
    ].filter(e => e).join(' ');

    return (
      isOpen
        ? (
          <li
            className={wrapperClassNames}
            onClick={() => {
              isMoveable && onClick(cardIndex, columnIndex);
            }}
          >
            <span>
              { this.labelFor(card) }
            </span>
          </li>
        )
        : <li className='Card isClosed' />
    );
  }
}
