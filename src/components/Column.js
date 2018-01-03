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

  noOp () {}

  render () {
    const { column, checkMoveable, checkOpen } = this.props;
    return (
      <li className='Column'>
        <ul className='Column_cards'>
          { column.cards.map((card, cardIndex) => {
            const isMoveable = checkMoveable(column.index, cardIndex);
            return <Card
              card={card}
              cardIndex={cardIndex}
              columnIndex={column.index}
              isMoveable={isMoveable}
              isOpen={checkOpen(column.index, cardIndex)}
              key={this.idFor(card)}
              onClick={isMoveable ? this.handleCardClick(cardIndex) : this.noOp}
            />;
          }
          )}
        </ul>
      </li>
    );
  }
}
