import {connect} from 'react-redux';

import WordCount from '../components/word_count';

const mapStateToProps = state => ({
  wordCount: state.foundWords.length,
  answerCount: state.gameState.answerCount,
});

const WordCountContainer = connect(mapStateToProps)(WordCount);

export default WordCountContainer;
