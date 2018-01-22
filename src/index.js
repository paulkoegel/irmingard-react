import React from 'react';
import ReactDOM from 'react-dom';
import { List } from 'immutable';
import './index.css';
import Game from 'components/Game';
import registerServiceWorker from './registerServiceWorker';
import shortCardId from 'helpers/shortCardId';
import restoreFromShortCardId from 'helpers/restoreFromShortCardId';
import { compressToBase64, decompressFromBase64 } from 'lz-string';
import { CardRecord, ColumnRecord, GameStateRecord, PileRecord } from 'setup';

const minifyCards = gameState => {
  return gameState
    .updateIn(['columns'], columns => columns.map(column =>
      column.updateIn(['cards'], cards => cards.map(shortCardId))))
    .updateIn(['piles'], piles => piles.map(pile =>
      pile.updateIn(['cards'], cards => cards.map(shortCardId))))
    .updateIn(['stack'], stack => stack.map(shortCardId));
};

const unminifyCards = gameState => {
  // if this manual reconstruction proves hard to maintain,
  // consider using https://github.com/glenjamin/transit-immutable-js
  return new GameStateRecord({
    ...gameState,
    columns: List(gameState.columns.map(column =>
      new ColumnRecord(column).updateIn(['cards'], cards => List(cards).map(restoreFromShortCardId)))),
    piles: List(gameState.piles.map(pile =>
      new PileRecord(pile).updateIn(['cards'], cards => List(cards).map(card => new CardRecord(restoreFromShortCardId(card)))))),
    stack: List(gameState.stack).map(card => new CardRecord(restoreFromShortCardId(card)))
  });
};

window.encodeGameState = gameState => {
  const compressedGameState = minifyCards(gameState);
  return compressToBase64(JSON.stringify(compressedGameState.toJS())).replace(/\+/g, '-').replace(/\//g, '_');
};

window.decodeGameState = encodedGameState => {
  return unminifyCards(JSON.parse(decompressFromBase64(encodedGameState.replace(/-/g, '+').replace(/_/g, '/'))));
};

// TODO: think about doing this with `setState` (and without unmounting) inside the Game component
window.restoreGameState = encodedGameState => {
  const gameState = window.decodeGameState(encodedGameState);
  ReactDOM.unmountComponentAtNode(document.getElementById('root')); // <Game> doesn't get properly reinitialized without this step
  ReactDOM.render(<Game gameState={gameState} />, document.getElementById('root'));
};

window.encodedGameStateFromUrl = () => {
  return window.location.search.substring(1, window.location.search.length);
};

const gameStateFromUrl = () => {
  const encodedGameStateFromUrl = window.encodedGameStateFromUrl();
  return encodedGameStateFromUrl ? window.decodeGameState(encodedGameStateFromUrl) : null;
};

ReactDOM.render(<Game gameState={gameStateFromUrl()} />, document.getElementById('root'));
registerServiceWorker();
