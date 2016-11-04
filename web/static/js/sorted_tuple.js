import {add} from './sorted_immutable_list';

const comparitor = a => (b => {
  const x = a[0], y = b[0];

  if (x < y) { return -1; }
  if (x == y) { return 0; }
  return 1;
});

export default add(comparitor, true);
