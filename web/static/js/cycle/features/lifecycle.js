import xs from 'xstream';

const reducers = {
  UPDATE_GAME_STATE(state, action) {
    const formatSecondsRemaining = seconds => Math.max(0, Math.floor(seconds));

    return {
      ...state,

      gameState: {
        ...action.state.data,

        state: action.state.data.state,
        grid: action.state.data.grid.match(/..../g),
        remaining: formatSecondsRemaining(action.state.data.remaining_msecs / 1000),
        answerCount: action.state.data.answer_count || action.state.data.answers.length,
      },

      guessOutcome: null,

      wordList: action.state.data.state === 'intermission' ? state.wordList : null,
      points: action.state.data.state === 'intermission' ? state.points : 0,
      positionState: action.state.data.state === 'intermission' ? state.positionState : null,
    }
  },
};

export default function lifecycleFeature(sources) {
  const gameState$ = sources.phoenix.events('game_state');

  const updateGameState$ = gameState$.map(state => ({type: 'UPDATE_GAME_STATE', state}));

  const action$ = xs.merge(
    updateGameState$,
  );

  return {action$, reducers};
}

