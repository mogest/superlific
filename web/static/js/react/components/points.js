import React from 'react';

const Points = ({points}) => {
  return (
    <div id="points">
      <span>{points}</span>
      {' '}pt{points == 1 ? '' : 's'}
    </div>
  );
};

export default Points;

