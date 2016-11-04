import xs from 'xstream';

export default function disableSelectionFeature(sources) {
  sources.DOM.select('body').events('selectstart').debug(ev => ev.preventDefault());

  return {
    action$: xs.never(),
    reducers: {},
  };
}
