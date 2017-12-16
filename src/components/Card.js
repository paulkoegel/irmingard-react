import React, { Component } from 'react';
// import colourForSuit from 'helpers/coulourForSuit';
import symbolForSuit from 'helpers/symbolForSuit';
import displayValueForCard from 'helpers/displayValueForCard';

export default class Card extends Component {
  labelFor (card) {
    return `${symbolForSuit(card.get('suit'))} ${displayValueForCard(card)}`;
  }

  render () {
    const { card } = this.props;
    const isOpen = card.get('isOpen');
    return (
      isOpen
        ? <li className={`Card isOpen${card.get('isMoving') ? ' isMoving' : ''}`}>
          <span>
            { this.labelFor(card) }
          </span>
        </li>
        : <li className='Card isClosed' />
    );
  }
}
