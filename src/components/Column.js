import React, { Component } from 'react';
import Card from './Card';

export default class Column extends Component {
  idFor (card) {
    const { deck, suit, value } = card;
    return [deck, suit, value].join('.');
  }

  render () {
    return (
      <li className='Column'>
        <ul className='Column_cards'>
          { this.props.column.get('cards').map((card, index) =>
            <Card card={card} columnIndex={this.props.index} cardIndex={index} key={this.idFor(card)} />
          )}
        </ul>
      </li>
    );
  }
}
