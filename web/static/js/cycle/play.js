import {run} from '@cycle/xstream-run';
import {makeDOMDriver} from '@cycle/dom';
import {makePhoenixChannelDriver} from './phoenix_channel_driver';

import {Socket} from "phoenix";

import intent from './intent';
import model from './model';
import view from './view';

const socket = new Socket("/socket");
socket.connect();

const token = document.querySelector("meta[name='user-token']").getAttribute("content");
const channel = socket.channel("room:4x4/3", {token: token});

function main(sources) {
  const actions = intent(sources);
  const {state$, submitAnswer$} = model(actions);
  const vdom$ = view(state$);

  return {
    DOM: vdom$,
    phoenix: submitAnswer$.map(word => ({event: 'answer', data: {word}})),
  };
}

const drivers = {
  DOM: makeDOMDriver("main"),
  phoenix: makePhoenixChannelDriver(channel)
};

export default function() {
  run(main, drivers);
}
