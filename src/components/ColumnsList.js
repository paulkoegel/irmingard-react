import React, { Component } from 'react';
import Column from './Column';

export default class ColumnsList extends Component {
  render () {
    return (
      <ul className='ColumnsList'>
        { this.props.columns.map((column, index) => <Column column={column} key={index} />
        )}
      </ul>
    );
  }
}
