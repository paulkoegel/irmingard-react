import React, { Component } from 'react';
import './App.css';
import { shuffledStack } from './setup';

export default class App extends Component {
  render () {
    return (
      <pre>
        {JSON.stringify(shuffledStack(), null, 2)}
      </pre>
    );
  }
}
