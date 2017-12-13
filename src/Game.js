import './Game.css';
import React, { Component } from 'react';
import ColumnsList from './components/ColumnsList';

export default class Game extends Component {
  render () {
    return (
      <ColumnsList columns={this.props.gameState.get('columns')} />
    );
  }
}
