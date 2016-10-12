import React from 'react';

const text = {
  unique: 'accepted',
  duplicate: 'is a duplicate',
  existing: 'is already in your list',
  invalid: 'is not a valid word',
};

const Status = ({status}) => {
  const {outcome, word} = status;

  if (!outcome) { return <div id="entry">&nbsp;</div>; }

  const className = outcome === 'unique' ? 'accepted' : 'invalid';

  return (
    <div id="entry" className={className}>
      {word} {text[outcome]}
    </div>
  );
};

export default Status;
