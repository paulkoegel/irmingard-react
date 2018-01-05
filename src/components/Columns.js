import React, { Component } from 'react';
import Column from './Column';

export default class Columns extends Component {
  render () {
    const { columns, movingCoordinates, onCardClick } = this.props;

    return (
      <ul className='Columns'>
        { columns.map((column, index) => (
          <Column
            column={column}
            key={index}
            movingCoordinates={movingCoordinates}
            onCardClick={onCardClick}
          />
        ))}
      </ul>
    );
  }
}
