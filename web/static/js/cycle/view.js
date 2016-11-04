import {table, tr, td, div, span, section, ul, li} from '@cycle/dom';

function renderTimer(seconds) {
  return div("#timer", [
    span(seconds + ""),
    span(" sec" + (seconds == 1 ? '' : 's'))
  ]);
}

function renderPoints(points) {
  return (
    div("#points", [
      span(points + ""),
      " pt" + (points == 1 ? '' : 's')
    ])
  );
}

const selectionColours = ["#d6c5b4", "#cba", "#d6ccb5", "#ddb", "#eec", "#eea", "#ee9", "#ee8", "#ee7", "#ee6", "#ee5", "#ee4", "#ee3", "#ee2", "#ee1"];

function renderGrid(grid, selectedCells, primaryIdentifier) {
  return div("#grid", [
    table(grid.map((line, y) =>
      tr(line.split('').map((letter, x) => {
        const id = 'cell' + (y * 4 + x);

        let colour;

        if (typeof(primaryIdentifier) === 'number') {
          const primaryCells = selectedCells.get(primaryIdentifier);
          const primaryIndex = primaryCells.findIndex(cell => cell.id === id);

          if (primaryIndex !== -1) {
            colour = selectionColours[primaryIndex];
          }
          else if ([...selectedCells.values()].some(cells => cells.some(cell => cell.id === id))) {
            colour = "#b4c5d6";
          }
        }

        const style = colour ? {'background-color': colour} : {};

        return td(`#${id}`, {style}, letter === 'Q' ? 'Qu' : letter)
      }))
    ))
  ]);
}

function renderPosition(positionState) {
  const {position, equal, total} = positionState;
  const cardinals = {1: 'st', 2: 'nd', 3: 'rd'};
  const equalSign = equal ? '=' : '';
  let cardinal = '';

  if (position === parseInt(position)) {
    cardinal = position < 11 || position > 13 ? cardinals[position % 10] || 'th' : 'th';
  }

  return div("#position", [
    span(position),
    `${cardinal}${equalSign} / ${total}`,
  ]);
}

function renderGuessOutcome(guessOutcome) {
  const {word, outcome} = guessOutcome;
  const cssClass = outcome === 'unique' ? 'accepted' : 'invalid';

  const text = {
    unique: 'accepted',
    duplicate: 'is a duplicate',
    existing: 'is already in your list',
    invalid: 'is not a valid word',
  };

  return div("#entry." + cssClass, `${word} ${text[outcome]}`);
}

function renderSelectedCells(selectedCells, primaryIdentifier) {
  const extractWord = cells => cells.map(cell => cell.innerHTML).join("").toUpperCase();

  let word = extractWord(selectedCells.get(primaryIdentifier));

  for (let [key, cells] of selectedCells) {
    if (key !== primaryIdentifier) {
      word += " + -" + extractWord(cells);
    }
  }

  return div("#entry", word);
}

function renderWordCount(wordCount, answerCount) {
  return div("#word-count", `${wordCount} / ${answerCount} words`);
}

function renderWordList(wordList) {
  return ul("#word-list", (wordList || []).map(([word, state]) => li("." + state, word)));
}

export default function view(state$) {
  return state$.map(({gameState, points, positionState, guessOutcome, wordList, selectedCells, primaryIdentifier}) =>
    section(".game." + (gameState.state || 'loading'), [
      div(".sidebar", [
        typeof(primaryIdentifier) === 'number' ? renderSelectedCells(selectedCells, primaryIdentifier) : (guessOutcome ? renderGuessOutcome(guessOutcome) : null),

        div("#metrics", [
          renderPoints(points),
          renderTimer(gameState.remaining),
          positionState ? renderPosition(positionState) : div("#position"),
        ]),

        renderWordCount(wordList ? wordList.length : 0, gameState.answerCount),

        renderWordList(wordList),
      ]),

      renderGrid(gameState.grid, selectedCells, primaryIdentifier),
    ])
  );
}
