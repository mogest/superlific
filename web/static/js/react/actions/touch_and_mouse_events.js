function dispatchTouches(dispatch, touches, type) {
  for (const touch of touches) {
    dispatch({
      type,
      touch,
      identifier: touch.identifier,
      element: document.elementFromPoint(touch.clientX, touch.clientY),
    });
  }
}

function createMouseAction(syntheticEvent, type) {
  const event = syntheticEvent.nativeEvent;

  syntheticEvent.preventDefault();

  return {
    type: type,
    touch: {clientX: event.clientX, clientY: event.clientY},
    identifier: -1,
    element: document.elementFromPoint(event.clientX, event.clientY),
  };
}


function asyncTouchEvent(event, type) {
  event.preventDefault();
  return dispatch => dispatchTouches(dispatch, event.nativeEvent.changedTouches, type);
}

export function touchStarted(event) {
  return asyncTouchEvent(event, 'SELECTION_STARTED');
}

export function touchMoved(event) {
  return asyncTouchEvent(event, 'SELECTION_MOVED');
}

export function touchEnded(event) {
  return asyncTouchEvent(event, 'SELECTION_ENDED');
}

export function mouseDown(event) {
  return createMouseAction(event, 'SELECTION_STARTED');
}

export function mouseMove(event) {
  return createMouseAction(event, 'SELECTION_MOVED');
}

export function mouseUp(event) {
  return createMouseAction(event, 'SELECTION_ENDED');
}
