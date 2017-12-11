import { List } from 'immutable';

// shuffle (source: https://github.com/ramda/ramda/issues/168#issuecomment-314525390)
export const shuffle = list => {
  let idx = -1;
  const len = list.length;
  let position;
  const result = [];
  while (++idx < len) {
    position = Math.floor((idx + 1) * Math.random());
    result[idx] = result[position];
    result[position] = list[idx];
  }
  return result;
};

export default immutableList => {
  let idx = -1;
  const size = immutableList.size;
  let position;
  const result = [];
  while (++idx < size) {
    position = Math.floor((idx + 1) * Math.random());
    result[idx] = result[position];
    result[position] = immutableList.get(idx);
  }
  return List(result);
};
