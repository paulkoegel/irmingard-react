import React, { Component } from 'react';
import Card from './Card';

export default class Column extends Component {
  idFor (card) {
    return `${card.get('deck')}.${card.get('suit')}.${card.get('value')}`;
  }

  render () {
    return (
      <li className='Column'>
        <ul>
          { this.props.column.get('cards').map(card =>
            <Card card={card} key={this.idFor(card)} />
          )}
        </ul>
      </li>
    );
  }
}
