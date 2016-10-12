function removeByKey(map, deleteKey) {
  return [...map.entries()]
    .filter(([key, _]) => key !== deleteKey)
    .reduce((result, [key, value]) => result.set(key, value), new Map());
}

function isSufficientlyCloseToCentreOfElement(element, touch) {
  const rect = element.getBoundingClientRect();
  const x = (rect.width / 2) - (touch.clientX - rect.left);
  const y = (rect.height / 2) - (touch.clientY - rect.top);

  const distanceFromCellCentre = Math.sqrt(x*x + y*y);

  return distanceFromCellCentre <= rect.width / 2 * 0.8;
}

function extractWordFromCells(cells) {
  return cells.map(cell => cell.innerHTML).join("").toUpperCase();
}

const initialSelectionState = {
  cells: new Map(),
  primaryIdentifier: null,
};

const selectionReducer = (state = initialSelectionState, action) => {
  switch (action.type) {
    case 'SELECTION_STARTED':
      return {
        cells: new Map([
          ...state.cells,

          [action.identifier, [action.element]]
        ]),

        primaryIdentifier: typeof(state.primaryIdentifier) === 'number' ? state.primaryIdentifier : action.identifier,
      };

    case 'SELECTION_MOVED':
      const cells = state.cells.get(action.identifier);

      if (!cells || cells[cells.length - 1].id === action.element.id) {
        return state;
      }

      if (!isSufficientlyCloseToCentreOfElement(action.element, action.touch)) {
        return state;
      }

      const index = cells.findIndex(cell => cell.id === action.element.id);
      if (index !== -1) {
        return {
          primaryIdentifier: state.primaryIdentifier,
          cells: new Map([
            ...state.cells,

            [action.identifier, cells.slice(0, index + 1)],
          ]),
        };
      }

      return {
        ...state,

        cells: new Map([
          ...state.cells,

          [action.identifier, [...cells, action.element]],
        ]),
      };

    case 'SELECTION_ENDED':
      let word = extractWordFromCells(state.cells.get(action.identifier));

      if (typeof(state.primaryIdentifier) === 'number' && state.primaryIdentifier !== action.identifier) {
        word = extractWordFromCells(state.cells.get(state.primaryIdentifier)) + word;
      }

      const newCells = removeByKey(state.cells, action.identifier);

      const newPrimaryIdentifier = state.primaryIdentifier === action.identifier
        ? newCells.keys().next().value
        : state.primaryIdentifier;

      return {
        submitWord: word,
        cells: newCells,
        primaryIdentifier: newPrimaryIdentifier,
      };

    case 'SELECTION_SENT':
      return {
        cells: state.cells,
        primaryIdentifier: state.primaryIdentifier,
      };

    default:
      return state;
  }
};

export default selectionReducer;
