export default function intent(sources) {
  const gameState$ = sources.phoenix.events('game_state');
  const positionState$ = sources.phoenix.events('position');

  const answerResponses = sources.phoenix.responses('answer');
  const uniqueAnswerOutcome$ = answerResponses.events('unique');
  const duplicateAnswerOutcome$ = answerResponses.events('duplicate');
  const existingAnswerOutcome$ = answerResponses.events('existing');
  const invalidAnswerOutcome$ = answerResponses.events('invalid');

  const duplicationState$ = sources.phoenix.events('duplication');

  const formSubmission$ = sources.DOM.select('form').events('submit').debug(ev => ev.preventDefault());
  const wordEntry$ = sources.DOM.select('#word').events('input').map(ev => ev.target.value);

  const submitWord$ = wordEntry$.map(word => formSubmission$.mapTo(word)).flatten();

  const cellTouched$ = sources.DOM.select('td').events('touchstart');
  const cellTouchMoved$ = sources.DOM.select('td').events('touchmove');
  const cellTouchLifted$ = sources.DOM.select('td').events('touchend');

  const cellMouseDown$ = sources.DOM.select('td').events('mousedown');
  const cellMouseMoved$ = sources.DOM.select('td').events('mousemove');
  const cellMouseLifted$ = sources.DOM.select('td').events('mouseup');

  // Prevent selecting text in some browsers
  sources.DOM.select('body').events('selectstart').debug(ev => ev.preventDefault());

  return {
    gameState$,
    positionState$,
    submitWord$,
    uniqueAnswerOutcome$,
    duplicateAnswerOutcome$,
    existingAnswerOutcome$,
    invalidAnswerOutcome$,
    duplicationState$,
    cellTouched$,
    cellTouchMoved$,
    cellTouchLifted$,
    cellMouseDown$,
    cellMouseMoved$,
    cellMouseLifted$,
  };
}
