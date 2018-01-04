import React, { Component } from 'react';
import Card from './Card';

export default class Column extends Component {
  idFor (card) {
    const { deck, suit, value } = card;
    return [deck, suit, value].join('.');
  }

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
    const { column } = this.props;
    return (
      <li className='Column'>
        <ul className='Column_cards'>
          { column.cards.map((card, cardIndex) => (
            <Card
              card={card}
              cardIndex={cardIndex}
              columnIndex={column.index}
              isMoveable={this.checkMoveable(column, cardIndex)}
              isOpen={this.checkOpen(column, cardIndex)}
              key={this.idFor(card)}
              onClick={this.handleCardClick(cardIndex)}
            />
          ))}
        </ul>
      </li>
    );
  }
}
