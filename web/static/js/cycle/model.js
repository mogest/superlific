import xs from 'xstream';
import {add as addToList} from '../sorted_immutable_list';

function removeByKey(map, deleteKey) {
  return [...map.entries()]
    .filter(([key, _]) => key !== deleteKey)
    .reduce((result, [key, value]) => result.set(key, value), new Map());
}

const reducers = {
  UPDATE_GAME_STATE(state, action) {
    const formatSecondsRemaining = seconds => Math.max(0, Math.floor(seconds));

    return {
      ...state,

      gameState: {
        ...action.state.data,

        state: action.state.data.state,
        grid: action.state.data.grid.match(/..../g),
        remaining: formatSecondsRemaining(action.state.data.remaining_msecs / 1000),
        answerCount: action.state.data.answer_count || action.state.data.answers.length,
      },

      guessOutcome: null,

      wordList: action.state.data.state === 'intermission' ? state.wordList : null,
      points: action.state.data.state === 'intermission' ? state.points : 0,
      positionState: action.state.data.state === 'intermission' ? state.positionState : null,
    }
  },

  UPDATE_DUPLICATED_WORD(state, action) {
    return {
      ...state,

      points: action.state.data.points,
      wordList: addToList(state.wordList, action.state.data.word, 'duplicate'),
    };
  },

  DECREASE_TIMER(state, action) {
    return {
      ...state,

      gameState: {
        ...state.gameState,

        remaining: typeof(state.gameState.remaining) === 'undefined' ? null : Math.max(0, state.gameState.remaining - 1),
      },
    }
  },

  SUCCESSFUL_GUESS(state, action) {
    return {
      ...state,

      points: action.data.points,
      wordList: addToList(state.wordList, action.data.request.data.word, 'unique'),
      guessOutcome: {
        word: action.data.request.data.word,
        outcome: 'unique',
      },
    };
  },

  DUPLICATE_GUESS(state, action) {
    return {
      ...state,

      wordList: addToList(state.wordList, action.data.request.data.word, 'duplicate'),
      guessOutcome: {
        word: action.data.request.data.word,
        outcome: 'duplicate',
      },
    };
  },

  EXISTING_GUESS(state, action) {
    return {
      ...state,

      guessOutcome: {
        word: action.data.request.data.word,
        outcome: 'existing',
      },
    };
  },

  INVALID_GUESS(state, action) {
    return {
      ...state,

      guessOutcome: {
        word: action.data.request.data.word,
        outcome: 'invalid',
      },
    };
  },

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

  SELECTION_STARTED(state, action) {
    return {
      ...state,

      selectedCells: new Map([
        ...state.selectedCells,

        [action.identifier, [action.element]],
      ]),

      primaryIdentifier: typeof(state.primaryIdentifier) === 'number' ? state.primaryIdentifier : action.identifier,
    };
  },

  SELECTION_MOVED(state, action) {
    let cells = state.selectedCells.get(action.identifier);

    if (!cells || cells[cells.length - 1].id === action.element.id) {
      return state;
    }

    let rect = action.element.getBoundingClientRect();
    let x = (rect.width / 2) - (action.touch.clientX - rect.left);
    let y = (rect.height / 2) - (action.touch.clientY - rect.top);

    let distanceFromCellCentre = Math.sqrt(x*x + y*y);

    if (distanceFromCellCentre > rect.width / 2 * 0.8) {
      return state;
    }

    let index = cells.findIndex(cell => cell.id === action.element.id);
    if (index !== -1) {
      return {
        ...state,

        selectedCells: new Map([
          ...state.selectedCells,

          [action.identifier, cells.slice(0, index + 1)],
        ]),
      };
    }

    return {
      ...state,

      selectedCells: new Map([
        ...state.selectedCells,

        [action.identifier, [...cells, action.element]],
      ]),
    };
  },

  SELECTION_ENDED(state, action) {
    const extractWord = cells => cells.map(cell => cell.innerHTML).join("").toUpperCase();

    let word = extractWord(state.selectedCells.get(action.identifier));

    if (typeof(state.primaryIdentifier) === 'number' && state.primaryIdentifier !== action.identifier) {
      word = extractWord(state.selectedCells.get(state.primaryIdentifier)) + word;
    }

    const newSelectedCells = removeByKey(state.selectedCells, action.identifier);

    const newPrimaryIdentifier = state.primaryIdentifier === action.identifier
      ? newSelectedCells.keys().next().value
      : state.primaryIdentifier;

    return {
      ...state,

      submitWord: word,

      selectedCells: newSelectedCells,

      primaryIdentifier: newPrimaryIdentifier,
    };
  },
}

function actionReducer(state, action) {
  const reducer = reducers[action.type];

  if (!reducer) {
    throw new Error(`Implement a reducer for action type: ${JSON.stringify(action)}`);
  }

  return reducers[action.type](state, action);
}

function convertTouchToElementAndIdentifier(touch) {
  let element = document.elementFromPoint(touch.clientX, touch.clientY);
  let identifier = touch.identifier;

  return {element, identifier, touch};
}

function startTouchToAction(touch) {
  return {type: 'SELECTION_STARTED', ...convertTouchToElementAndIdentifier(touch)};
}

function moveTouchToAction(touch) {
  return {type: 'SELECTION_MOVED', ...convertTouchToElementAndIdentifier(touch)};
}

function endTouchToAction(touch) {
  return {type: 'SELECTION_ENDED', ...convertTouchToElementAndIdentifier(touch)};
}

function touchEvent$ToTouch$(touchEvent$) {
  return touchEvent$
    .map(event => xs.fromArray(event.changedTouches))
    .flatten();
}

function mouseEvent$ToTouch$(mouseEvent$) {
  return mouseEvent$.map(event => ({
    clientX: event.clientX,
    clientY: event.clientY,
    identifier: -1,
  }));
}

export default function model(actions) {
  const initialState = {
    gameState: null,
    selectedCells: new Map(),
    timeRemaining: 0,
    points: 0,
  }

  const updateGameState$ = actions.gameState$.map(state => ({type: 'UPDATE_GAME_STATE', state}));
  const updatePositionState$ = actions.positionState$.map(state => ({type: 'UPDATE_POSITION_STATE', state}));
  const updateDuplicationState$ = actions.duplicationState$.map(state => ({type: 'UPDATE_DUPLICATED_WORD', state}));
  const decreaseTimer$ = xs.periodic(1000).mapTo({type: 'DECREASE_TIMER'});
  const successfulGuess$ = actions.uniqueAnswerOutcome$.map(data => ({type: 'SUCCESSFUL_GUESS', data}));
  const invalidGuess$ = actions.invalidAnswerOutcome$.map(data => ({type: 'INVALID_GUESS', data}));
  const duplicateGuess$ = actions.duplicateAnswerOutcome$.map(data => ({type: 'DUPLICATE_GUESS', data}));
  const existingGuess$ = actions.existingAnswerOutcome$.map(data => ({type: 'EXISTING_GUESS', data}));

  const selectionStarted$ = xs.merge(
      actions.cellTouched$.compose(touchEvent$ToTouch$),
      actions.cellMouseDown$.compose(mouseEvent$ToTouch$)
    )
    .map(startTouchToAction);

  const selectionMoved$ = xs.merge(
      actions.cellTouchMoved$.debug(ev => ev.preventDefault()).compose(touchEvent$ToTouch$),
      actions.cellMouseMoved$.debug(ev => ev.preventDefault()).compose(mouseEvent$ToTouch$)
    )
    .map(moveTouchToAction);

  const selectionEnded$ = xs.merge(
      actions.cellTouchLifted$.compose(touchEvent$ToTouch$),
      actions.cellMouseLifted$.compose(mouseEvent$ToTouch$)
    )
    .map(endTouchToAction);

  const action$ = xs.merge(
    updateGameState$,
    updatePositionState$,
    updateDuplicationState$,
    decreaseTimer$,
    successfulGuess$,
    invalidGuess$,
    duplicateGuess$,
    existingGuess$,
    selectionStarted$,
    selectionMoved$,
    selectionEnded$,
  );

  const state$ = action$
    .fold(actionReducer, initialState)
    .filter(state => !!state.gameState);

  const submitAnswer$ = selectionEnded$
    .mapTo(state$.take(1).map(state => state.submitWord))
    .flatten()
    .filter(word => !!word);

  return {state$, submitAnswer$};
}
