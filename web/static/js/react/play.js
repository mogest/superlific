import React from 'react';
import {render} from 'react-dom';

import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';

import rootReducer from './reducers/index';
import ApplicationContainer from './containers/application_container';
import connectToServer from './server';

import decrementTimer from './actions/decrement_timer';

function renderPage(store) {
  const html = (
    <Provider store={store}>
      <ApplicationContainer />
    </Provider>
  );

  const element = document.getElementsByTagName('main')[0];

  render(html, element);
}

function tick(store) {
  store.dispatch(decrementTimer());
}

export default function() {
  const store = createStore(
    rootReducer,
    applyMiddleware(thunkMiddleware)
  );

  setInterval(() => tick(store), 1000);

  connectToServer(store)
    .then(() => renderPage(store))
    .catch(error => {
      console.error(error);
      alert('error: ' + error);
    });
}
