import xs from 'xstream';
import add from '../../sorted_tuple';

const reducers = {
  SUCCESSFUL_GUESS(state, action) {
    return {
      ...state,

      points: action.data.points,
      wordList: add(state.wordList, [action.data.request.data.word, 'unique']),
      guessOutcome: {
        word: action.data.request.data.word,
        outcome: 'unique',
      },
    };
  },

  DUPLICATE_GUESS(state, action) {
    return {
      ...state,

      wordList: add(state.wordList, [action.data.request.data.word, 'duplicate']),
      guessOutcome: {
        word: action.data.request.data.word,
        outcome: 'duplicate',
      },
    };
  },

  EXISTING_GUESS(state, action) {
    return {
      ...state,

      guessOutcome: {
        word: action.data.request.data.word,
        outcome: 'existing',
      },
    };
  },

  INVALID_GUESS(state, action) {
    return {
      ...state,

      guessOutcome: {
        word: action.data.request.data.word,
        outcome: 'invalid',
      },
    };
  },
};

export default function consequencesFeature(sources) {
  const answerResponses = sources.phoenix.responses('answer');
  const uniqueAnswerOutcome$ = answerResponses.events('unique');
  const duplicateAnswerOutcome$ = answerResponses.events('duplicate');
  const existingAnswerOutcome$ = answerResponses.events('existing');
  const invalidAnswerOutcome$ = answerResponses.events('invalid');

  const successfulGuess$ = uniqueAnswerOutcome$.map(data => ({type: 'SUCCESSFUL_GUESS', data}));
  const invalidGuess$ = invalidAnswerOutcome$.map(data => ({type: 'INVALID_GUESS', data}));
  const duplicateGuess$ = duplicateAnswerOutcome$.map(data => ({type: 'DUPLICATE_GUESS', data}));
  const existingGuess$ = existingAnswerOutcome$.map(data => ({type: 'EXISTING_GUESS', data}));

  const action$ = xs.merge(
    successfulGuess$,
    invalidGuess$,
    duplicateGuess$,
    existingGuess$,
  );

  return {action$, reducers};
}
