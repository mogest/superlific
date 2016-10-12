export function add(list, word, state) {
  if (list) {
    let low = -1, high = list.length;

    while (low !== high - 1) {
      let mid = Math.floor((high - low) / 2 + low);
      let midWord = list[mid][0];

      if (word > midWord) {
        low = mid;
      }
      else if (midWord === word) {
        return list.slice(0, mid).concat([[word, state]]).concat(list.slice(mid + 1));
      }
      else {
        high = mid;
      }
    }

    return list.slice(0, high).concat([[word, state]]).concat(list.slice(high));
  }
  else {
    return [[word, state]];
  }
}
