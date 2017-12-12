import './App.css';
import React, { Component } from 'react';
import { initialGameState, serveCards } from './setup';

export default class App extends Component {
  render () {
    return (
      <pre>
        {JSON.stringify(serveCards(initialGameState), null, 2)}
      </pre>
    );
  }
}
