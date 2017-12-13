import React, { Component } from 'react';

export default class Card extends Component {
  colour (card) {
    if (['diamonds', 'hearts'].includes(card.get('suit'))) {
      return 'red';
    } else if (['clubs', 'spades'].includes(card.get('suit'))) {
      return 'black';
    } else {
      throw (new Error(`Card.colour: card is neither red nor black!? ${JSON.stringify(card)}`));
    }
  }

  symbolFor (card) {
    switch (card.get('suit')) {
      case 'spades':
        return '♠';
      case 'hearts':
        return '♥';
      case 'diamonds':
        return '♦';
      case 'clubs':
        return '♣';
      default:
        throw (new Error(`Card.symbolFor: card has no suit!? ${JSON.stringify(card)}`));
    }
  }

  displayValue (card) {
    switch (card.get('value')) {
      case 1:
        return 'A';
      case 11:
        return 'J';
      case 12:
        return 'Q';
      case 13:
        return 'K';
      default:
        return card.get('value').toString();
    }
  }

  labelFor (card) {
    return `${this.symbolFor(card)} ${this.displayValue(card)}`;
  }

  render () {
    const { card } = this.props;
    return (
      card.get('isOpen')
        ? <li className={`Card isOpen${card.get('isMoving') ? ' isMoving' : ''}`}>
          <span className=''>{ this.labelFor(card) }</span>
        </li>
        : <li className='Card isClosed' />
    );
  }
}
