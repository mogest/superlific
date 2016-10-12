import React from 'react';

const cardinals = {1: 'st', 2: 'nd', 3: 'rd'};

function cardinalOf(number) {
  if (number === parseInt(number)) {
    return number < 11 || number > 13 ? cardinals[number % 10] || 'th' : 'th';
  }
}

const Position = ({data}) => {
  const {position, equal, count} = data;
  const equalSign = equal ? '=' : '';

  if (!position) { return <div id="position">&nbsp;</div>; }

  return (
    <div id="position">
      <span>{position}</span>{cardinalOf(position)}{equalSign} / {count}
    </div>
  );
};

export default Position;
