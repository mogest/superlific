/*
example usage:

const comparitor = a => (b => {
  const x = a[0], y = b[0];

  if (x < y) { return -1; }
  if (x == y) { return 0; }
  return 1;
});

const tupleAdd = add(comparitor, true);

const log = values => {
  console.log(values.map(value => value.join(", ")));
};

const a = tupleAdd([], [4, 'apple']);
log(a);

const b = tupleAdd(a, [6, 'banana']);
log(b);

const c = tupleAdd(b, [3, 'carrot']);
log(c);

const d = tupleAdd(c, [5, 'date']);
log(d);

const e = tupleAdd(d, [5, 'eggplant']);
log(e);
*/

export function add(comparitor, unique) {
  if (!comparitor) {
    comparitor = a => (b => {
      if (a < b) { return -1; }
      if (a == b) { return 0; }
      return 1;
    });
  }

  return function(list, value) {
    if (list) {
      const seededComparitor = comparitor(value);
      let low = -1, high = list.length;

      while (low !== high - 1) {
        const mid = Math.floor((high - low) / 2 + low);
        const comparison = seededComparitor(list[mid]);

        if (comparison > 0) {
          low = mid;
        }
        else if (comparison === 0) {
          if (unique) {
            const newList = list.slice(0);
            newList[mid] = value;
            return newList;
          }
          else {
            return list.slice(0, mid).concat([value]).concat(list.slice(mid));
          }
        }
        else {
          high = mid;
        }
      }

      return list.slice(0, high).concat([value]).concat(list.slice(high));
    }
    else {
      return [value];
    }
  }
}
