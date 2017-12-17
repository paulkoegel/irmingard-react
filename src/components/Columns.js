import React, { Component } from 'react';
import Column from './Column';

export default class Columns extends Component {
  render () {
    return (
      <ul className='Columns'>
        { this.props.columns.map((column, index) => <Column column={column} key={index} index={index} />
        )}
      </ul>
    );
  }
}
