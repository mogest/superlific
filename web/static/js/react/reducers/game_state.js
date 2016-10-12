const initialGameState = {
  points: 0,
};

const gameStateReducer = (state = initialGameState, action) => {
  switch (action.type) {
    case 'NEW_GAME_STARTED':
      return {
        ...action.data,

        points: 0,
      };

    case 'INTERMISSION_STARTED':
      return {
        ...state,
        ...action.data,
      };

    case 'DECREMENT_TIMER':
      return {
        ...state,

        remainingSeconds: state.remainingSeconds ? state.remainingSeconds - 1 : 0
      };

    case 'UNIQUE_SUBMISSION':
    case 'DUPLICATION_REPORTED':
      return {
        ...state,

        points: action.points,
      };

    default:
      return state;
  }
};

export default gameStateReducer;
