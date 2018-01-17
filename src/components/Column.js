import React, { Component } from 'react';
import Card from './Card';
import cardId from 'helpers/cardId';

export default class Column extends Component {
  handleCardClick = cardIndex => () => {
    const { column, onCardClick } = this.props;
    onCardClick(cardIndex, column.index);
  };

  checkMoveable (column, cardIndex) {
    return cardIndex >= column.moveableFromIndex;
  }

  checkOpen (column, cardIndex) {
    return cardIndex >= column.openFromIndex;
  }

  render () {
    const { column, markedCardCoordinates, onColumnCardClick, onPlaceholderClick } = this.props;

    return (
      <li className='Column'>
        <ul className='Column_cards'>
          { column.cards.size > 0
            ? column.cards.map((card, cardIndex) => (
              <Card
                card={card}
                cardIndex={cardIndex}
                columnIndex={column.index}
                isMoveable={this.checkMoveable(column, cardIndex)}
                isOpen={this.checkOpen(column, cardIndex)}
                key={cardId(card)}
                markedCardCoordinates={markedCardCoordinates}
                onCardClick={onColumnCardClick}
              />
            ))
            : <div
              className='Column_placeholder'
              onClick={onPlaceholderClick(column.index)}
            >
              Put a king here.
            </div>
          }
        </ul>
      </li>
    );
  }
}
