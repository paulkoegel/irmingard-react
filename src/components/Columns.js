import React, { Component } from 'react';
import Column from './Column';

export default class Columns extends Component {
  render () {
    const { checkMoveable, columns, onCardClick } = this.props;

    return (
      <ul className='Columns'>
        { columns.map((column, index) => (
          <Column
            checkMoveable={checkMoveable}
            column={column}
            key={index}
            onCardClick={onCardClick}
          />
        ))}
      </ul>
    );
  }
}
