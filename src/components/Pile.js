import React, { Component } from 'react';
import Card from './Card';
import colourForSuit from 'helpers/colourForSuit';
import symbolForSuit from 'helpers/symbolForSuit';

export default class Pile extends Component {
  render () {
    const { movingCoordinates, onPileCardClick, pile } = this.props;
    const { cards, suit } = pile;
    const topCard = cards.last();
    const colour = colourForSuit(suit);
    const placeholderClassNames = [
      'Pile_placeholder',
      colour
    ].join(' ');

    return (
      <li className='Pile'>
        { topCard
          ? <ul>
            <Card
              card={topCard}
              onCardClick={onPileCardClick}
              movingCoordinates={movingCoordinates}
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
