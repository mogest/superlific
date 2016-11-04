import xs from 'xstream';

import combineFeatures from './combine_features';
import features from './features/index';

import makeSubmitAnswer$ from './effects/submit_answer';

export default function logic(sources) {
  const initialState = {
    gameState: null,
    selectedCells: new Map(),
    timeRemaining: 0,
    points: 0,
  }

  const {action$, reducer} = combineFeatures(sources, features);

  const state$ = action$
    .fold(reducer, initialState)
    .filter(state => !!state.gameState);

  const submitAnswer$ = makeSubmitAnswer$(state$, action$);

  return {state$, submitAnswer$};
}
