import React, { Component } from 'react';
import { last } from 'ramda';
import Card from './Card';
import colourForSuit from 'helpers/colourForSuit';
import symbolForSuit from 'helpers/symbolForSuit';

export default class Pile extends Component {
  render () {
    const { cards, suit } = this.props.pile;
    const topCard = last(cards);
    const colour = colourForSuit(suit);
    const placeholderClassNames = ['Pile_placeholder', colour].join(' ');

    return (
      <li className='Pile'>
        { topCard
          ? <Card card={topCard} />
          : <div className={placeholderClassNames}>
            { symbolForSuit(suit) }
          </div>
        }
      </li>
    );
  }
}
