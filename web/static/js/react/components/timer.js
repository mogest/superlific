import React from 'react';

const Timer = ({remainingSeconds}) => {
  return (
    <div id="timer">
      <span>{remainingSeconds}</span>
      <span> sec{remainingSeconds == 1 ? '' : 's'}</span>
    </div>
  );
};

export default Timer;
