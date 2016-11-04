import xs from 'xstream';

const reducers = {
  DECREASE_TIMER(state, action) {
    return {
      ...state,

      gameState: {
        ...state.gameState,

        remaining: typeof(state.gameState.remaining) === 'undefined' ? null : Math.max(0, state.gameState.remaining - 1),
      },
    }
  }
};


export default function timerFeature() {
  const decreaseTimer$ = xs.periodic(1000).mapTo({type: 'DECREASE_TIMER'});

  return {action$: decreaseTimer$, reducers};
}
