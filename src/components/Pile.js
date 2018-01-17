import React, { Component } from 'react';
import Card from './Card';
import colourForSuit from 'helpers/colourForSuit';
import symbolForSuit from 'helpers/symbolForSuit';

export default class Pile extends Component {
  render () {
    const { markedCardCoordinates, onPileCardClick, pile } = this.props;
    const { cards, suit } = pile;
    const topCard = cards.last();
    const colour = colourForSuit(suit);
    const placeholderClassNames = [
      'Pile_placeholder',
      'Card isOnPile',
      colour
    ].join(' ');

    return (
      <li className='Pile'>
        { topCard
          ? <ul>
            <Card
              card={topCard}
              onCardClick={onPileCardClick}
              markedCardCoordinates={markedCardCoordinates}
              pileIndex={pile.index}
            />
          </ul>
          : <div className={placeholderClassNames}>
            { symbolForSuit(suit) }
          </div>
        }
      </li>
    );
  }
}
