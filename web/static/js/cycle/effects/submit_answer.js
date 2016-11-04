export default function makeSubmitAnswer$(state$, action$) {
  const selectionEnded$ = action$.filter(action => action.type == 'SELECTION_ENDED');

  return selectionEnded$
    .mapTo(state$.take(1).map(state => state.submitWord))
    .flatten()
    .filter(word => !!word);
}
