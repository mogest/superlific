import xs from 'xstream';

const reducers = {
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
};

function removeByKey(map, deleteKey) {
  return [...map.entries()]
    .filter(([key, _]) => key !== deleteKey)
    .reduce((result, [key, value]) => result.set(key, value), new Map());
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

export default function selectionFeature({DOM}) {
  const cellTouched$ = DOM.select('td').events('touchstart');
  const cellTouchMoved$ = DOM.select('td').events('touchmove');
  const cellTouchLifted$ = DOM.select('td').events('touchend');

  const cellMouseDown$ = DOM.select('td').events('mousedown');
  const cellMouseMoved$ = DOM.select('td').events('mousemove');
  const cellMouseLifted$ = DOM.select('td').events('mouseup');

  const selectionStarted$ = xs.merge(
      cellTouched$.compose(touchEvent$ToTouch$),
      cellMouseDown$.compose(mouseEvent$ToTouch$)
    )
    .map(startTouchToAction);

  const selectionMoved$ = xs.merge(
      cellTouchMoved$.debug(ev => ev.preventDefault()).compose(touchEvent$ToTouch$),
      cellMouseMoved$.debug(ev => ev.preventDefault()).compose(mouseEvent$ToTouch$)
    )
    .map(moveTouchToAction);

  const selectionEnded$ = xs.merge(
      cellTouchLifted$.compose(touchEvent$ToTouch$),
      cellMouseLifted$.compose(mouseEvent$ToTouch$)
    )
    .map(endTouchToAction);

  const action$ = xs.merge(
    selectionStarted$,
    selectionMoved$,
    selectionEnded$,
  );

  return {action$, reducers};
}
