import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Game from './Game';
import registerServiceWorker from './registerServiceWorker';
import { newGameState } from './setup';

const initialGameState = newGameState();

ReactDOM.render(<Game gameState={initialGameState} />, document.getElementById('root'));
registerServiceWorker();
