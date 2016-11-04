import xs from 'xstream';

const reducers = {
  UPDATE_DUPLICATED_WORD(state, action) {
    return {
      ...state,

      points: action.state.data.points,
      wordList: addToList(state.wordList, action.state.data.word, 'duplicate'),
    };
  },
};

export default function wordDuplicatedFeature(sources) {
  const duplicationState$ = sources.phoenix.events('duplication');

  const updateDuplicationState$ = duplicationState$.map(state => ({type: 'UPDATE_DUPLICATED_WORD', state}));

  return {action$: updateDuplicationState$, reducers};
}

