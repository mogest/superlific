const formatSecondsRemaining = seconds => Math.max(0, Math.floor(seconds));

export default function(state) {
  const type = state.state === 'live' ? 'NEW_GAME_STARTED' : 'INTERMISSION_STARTED';

  return {
    type,
    data: {
      state: state.state,
      grid: state.grid.match(/..../g).map(line => line.split('')),
      remainingSeconds: formatSecondsRemaining(state.remaining_msecs / 1000),
      answerCount: state.answer_count || state.answers.length,
      answers: state.answers,
    }
  };
}
