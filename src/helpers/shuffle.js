import { List } from 'immutable';

// immutable shuffle (modified from this source: https://github.com/ramda/ramda/issues/168#issuecomment-314525390)
export default function immutableShuffle (immutableList) {
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
}
