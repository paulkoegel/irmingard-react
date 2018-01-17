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
      onCardClick(columnOrPileIndex, cardIndex); // onCardClick knows whether it's a column or a pile index
    }
  }

  render () {
    const {
      card,
      cardIndex,
      columnIndex,
      isMoveable,
      isOpen,
      markedCardCoordinates,
      pileIndex } = this.props;
    const { suit } = card;
    const isMarked =
      (columnIndex === markedCardCoordinates[0] && cardIndex >= markedCardCoordinates[1]) ||
      (pileIndex === markedCardCoordinates[0] - TOTAL_COLUMNS);
    const wrapperClassNames = ['Card',
      colourForSuit(suit),
      (pileIndex !== undefined) && 'isOnPile', // pileIndex can be 0 (which is falsy in JavaScript)
      isMarked && 'isMarked',
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
