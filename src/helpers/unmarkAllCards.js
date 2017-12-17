export default function unmarkAllCards (state) {
  return state.updateIn(['piles'], piles => {
    return piles.map(pile => {
      return pile.updateIn(['cards'], cards => {
        return cards.map(card => card.set('isMoving', false));
      });
    });
  }).updateIn(['columns'], columns => {
    return columns.map(column => {
      return column.updateIn(['cards'], cards => {
        return cards.map(card => card.set('isMoving', false));
      });
    });
  });
}
