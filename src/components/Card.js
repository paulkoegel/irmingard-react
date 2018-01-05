import React, { Component } from 'react';
import colourForSuit from 'helpers/colourForSuit';
import displayValueForCard from 'helpers/displayValueForCard';
import symbolForSuit from 'helpers/symbolForSuit';

export default class Card extends Component {
  labelFor (card) {
    return `${symbolForSuit(card.suit)} ${displayValueForCard(card)}`;
  }

  handleClick = () => {
    const { cardIndex, columnIndex, isMoveable, onCardClick } = this.props;
    if (isMoveable) {
      onCardClick(columnIndex, cardIndex);
    }
  }

  render () {
    const { card, cardIndex, columnIndex, isMoveable, movingCoordinates, isOpen } = this.props;
    const { suit } = card;
    const isMoving = columnIndex === movingCoordinates[0] && cardIndex >= movingCoordinates[1];
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
            onClick={this.handleClick}
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
