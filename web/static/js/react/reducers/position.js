const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'NEW_GAME_STARTED':
      return {};

    case 'UPDATE_POSITION':
      return action.data;

    default:
      return state;
  }
};

export default reducer;
