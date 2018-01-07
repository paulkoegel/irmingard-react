import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Game from 'components/Game';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Game />, document.getElementById('root'));
registerServiceWorker();

window.encodeGameState = gameState => {
  const columns = gameState.columns.toJS();
  const piles = gameState.piles.toJS();
  const stack = gameState.stack.toJS();

  return {columns, piles, stack};
  // TODO: other gameState attributes!
};

const decodeGameState = encodedGameState => {
  return encodedGameState;
};

window.restoreGameState = encodedGameState => {
  const gameState = decodeGameState(encodedGameState);
  ReactDOM.unmountComponentAtNode(document.getElementById('root')); // <Game> doesn't get properly reinitialized without this step
  ReactDOM.render(<Game gameState={gameState} />, document.getElementById('root'));
};
