import React from 'react';

const selectionColours = ["#d6c5b4", "#cba", "#d6ccb5", "#ddb", "#eec", "#eea", "#ee9", "#ee8", "#ee7", "#ee6", "#ee5", "#ee4", "#ee3", "#ee2", "#ee1"];

const secondarySelectionColour = "#b4c5d6";

function colourForCellID(id, selection) {
  const {primaryIdentifier, cells} = selection;

  if (typeof(primaryIdentifier) === 'number') {
    const primaryCells = cells.get(primaryIdentifier);
    const primaryIndex = primaryCells.findIndex(cell => cell.id === id);

    if (primaryIndex !== -1) {
      return selectionColours[Math.min(primaryIndex, selectionColours.length - 1)];
    }
    else if ([...cells.values()].some(cells => cells.some(cell => cell.id === id))) {
      return secondarySelectionColour;
    }
  }
}

const Cell = ({cell, index, selection}) => {
  const id = `cell${index}`;
  const colour = colourForCellID(id, selection);
  const style = {backgroundColor: colour};

  return (
    <td id={id} style={style}>
      {cell === 'Q' ? 'Qu' : cell}
    </td>
  );
};

const GridRow = ({row, rowIndex, selection}) => {
  return (
    <tr>
      {row.map((cell, index) => <Cell key={index} cell={cell} index={rowIndex * 4 + index} selection={selection} />)}
    </tr>
  );
};

export default function Grid({grid, selection, onTouchStart, onTouchMove, onTouchEnd, onMouseDown, onMouseMove, onMouseUp}) {
  if (!grid) { return null; }

  return (
    <div id="grid">
      <table
          onTouchStart={event => onTouchStart(event)}
          onTouchMove={event => onTouchMove(event)}
          onTouchEnd={event => onTouchEnd(event)}
          onMouseDown={event => onMouseDown(event)}
          onMouseMove={event => onMouseMove(event)}
          onMouseUp={event => onMouseUp(event)}>
        <tbody>
          {grid.map((row, index) => <GridRow key={index} row={row} rowIndex={index} selection={selection} />)}
        </tbody>
      </table>
    </div>
  );
};
