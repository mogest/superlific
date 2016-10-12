const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'NEW_GAME_STARTED':
    case 'INTERMISSION_STARTED':
      return {};

    case 'UNIQUE_SUBMISSION':
      return {outcome: 'unique', word: action.word};

    case 'DUPLICATE_SUBMISSION':
      return {outcome: 'duplicate', word: action.word};

    case 'EXISTING_SUBMISSION':
      return {outcome: 'existing', word: action.word};

    case 'INVALID_SUBMISSION':
      return {outcome: 'invalid', word: action.word};

    default:
      return state;
  }
};

export default reducer;

