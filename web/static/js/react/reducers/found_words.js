import add from '../../sorted_tuple';

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_GAME_STARTED':
      return [];

    case 'UNIQUE_SUBMISSION':
      return add(state, [action.word, 'unique']);

    case 'DUPLICATE_SUBMISSION':
      return add(state, [action.word, 'duplicate']);

    case 'DUPLICATION_REPORTED':
      return add(state, [action.word, 'duplicate']);

    case 'INTERMISSION_STARTED':
      const map = new Map(state);
      return action.data.answers.map(word => [word, map.get(word) || 'missed']);

    default:
      return state;
  }
};

export default reducer;
