import xs from 'xstream';

export default function combineFeatures(sources, features) {
  const calledFeatures = features.map(feature => feature(sources));

  const action$ = xs.merge(...calledFeatures.map(calledFeature => calledFeature.action$));

  const reducers = Object.assign({}, ...calledFeatures.map(calledFeature => calledFeature.reducers));

  const reducer = (state, action) => {
    const reducer = reducers[action.type];

    if (!reducer) {
      throw new Error(`Implement a reducer for action type: ${JSON.stringify(action)}`);
    }

    return reducer(state, action);
  }

  return {action$, reducer};
}
