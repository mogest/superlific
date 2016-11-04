import xs from 'xstream';

const reducers = {
  UPDATE_POSITION_STATE(state, action) {
    return {
      ...state,

      positionState: {
        position: action.state.data.position,
        equal: action.state.data.equal,
        total: action.state.data.count,
      }
    };
  },
};

export default function positionFeature(sources) {
  const positionState$ = sources.phoenix.events('position');

  const updatePositionState$ = positionState$.map(state => ({type: 'UPDATE_POSITION_STATE', state}));

  return {action$: updatePositionState$, reducers};
}

