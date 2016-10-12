import React from 'react';

import TimerContainer from '../containers/timer_container';
import StatusContainer from '../containers/status_container';
import PointsContainer from '../containers/points_container';
import PositionContainer from '../containers/position_container';
import WordListContainer from '../containers/word_list_container';
import WordCountContainer from '../containers/word_count_container';

const Metrics = () => {
  return (
    <div id="metrics">
      <PointsContainer />
      <TimerContainer />
      <PositionContainer />
    </div>
  );
};

export default function Sidebar() {
  return (
    <div className="sidebar">
      <StatusContainer />
      <Metrics />
      <WordCountContainer />
      <WordListContainer />
    </div>
  );
};
