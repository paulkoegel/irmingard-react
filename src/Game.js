import './Game.css';
import React, { Component } from 'react';
import ColumnsList from 'components/ColumnsList';
import Piles from 'components/Piles';

export default class Game extends Component {
  render () {
    return (
      <div>
        <ColumnsList columns={this.props.gameState.get('columns')} />
        <Piles piles={this.props.gameState.get('piles')} />
      </div>
    );
  }
}
