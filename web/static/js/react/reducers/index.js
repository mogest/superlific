import {combineReducers} from 'redux';

import gameStateReducer from './game_state';
import positionReducer from './position';
import selectionReducer from './selection';
import foundWordsReducer from './found_words';
import statusReducer from './status';

const rootReducer = combineReducers({
  gameState: gameStateReducer,
  position: positionReducer,
  selection: selectionReducer,
  foundWords: foundWordsReducer,
  status: statusReducer,
});

export default rootReducer;
