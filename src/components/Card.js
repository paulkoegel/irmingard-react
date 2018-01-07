import React, { Component } from 'react';
import colourForSuit from 'helpers/colourForSuit';
import displayValueForCard from 'helpers/displayValueForCard';
import symbolForSuit from 'helpers/symbolForSuit';
import { TOTAL_COLUMNS } from 'setup';

export default class Card extends Component {
  labelFor (card) {
    return `${symbolForSuit(card.suit)} ${displayValueForCard(card)}`;
  }

  handleClick = () => {
    const { cardIndex, columnIndex, isMoveable, onCardClick, pileIndex } = this.props;

    if (isMoveable || pileIndex !== undefined) {
      const columnOrPileIndex = columnIndex !== undefined ? columnIndex : pileIndex; // cannot use `||` because 0 is falsy
      onCardClick(columnOrPileIndex, cardIndex);
    }
  }

  render () {
    const {
      card,
      cardIndex,
      columnIndex,
      isMoveable,
      isOpen,
      movingCoordinates,
      pileIndex } = this.props;
    const { suit } = card;
    const isMoving =
      (columnIndex === movingCoordinates[0] && cardIndex >= movingCoordinates[1]) ||
      (pileIndex === movingCoordinates[0] - TOTAL_COLUMNS);
    const wrapperClassNames = ['Card',
      colourForSuit(suit),
      (pileIndex !== undefined) && 'isOnPile', // pileIndex can be 0 (which is falsy in JavaScript)
      isMoving && 'isMoving',
      isMoveable && 'isMoveable',
      'isOpen'
    ].filter(e => e).join(' ');

    return (
      isOpen || pileIndex !== undefined // pileIndex can be 0 (which is falsy in JavaScript)
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
