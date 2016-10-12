import {Socket} from "phoenix";

import updateGameState from './actions/update_game_state';
import updatePosition from './actions/update_position';
import updateDuplication from './actions/update_duplication';
import {selectionSent, uniqueSubmission, duplicateSubmission, existingSubmission, invalidSubmission} from './actions/submission';

export default function startPhoenixChannel(store) {
  const socket = new Socket("/socket");
  socket.connect();

  const token = document.querySelector("meta[name='user-token']").getAttribute("content");

  const channel = socket.channel("room:4x4/3", {token: token});

  channel.on('game_state', state => {
    store.dispatch(updateGameState(state));
  });

  channel.on('position', state => {
    store.dispatch(updatePosition(state));
  });

  channel.on('duplication', data => {
    store.dispatch(updateDuplication(data));
  });

  store.subscribe(() => {
    const state = store.getState();

    if (state.selection.submitWord) {
      const word = state.selection.submitWord;

      store.dispatch(selectionSent());

      channel.push('answer', {word})
        .receive('unique', result => store.dispatch(uniqueSubmission(word, result)))
        .receive('duplicate', () => store.dispatch(duplicateSubmission(word)))
        .receive('existing', () => store.dispatch(existingSubmission(word)))
        .receive('invalid', () => store.dispatch(invalidSubmission(word)));
    }
  });

  return new Promise((resolve, reject) => {
    channel.join()
      .receive("ok", resolve)
      .receive("error", reject);
  });
}
