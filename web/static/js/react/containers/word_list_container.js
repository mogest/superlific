import {connect} from 'react-redux';

import WordList from '../components/word_list';

const mapStateToProps = state => ({
  foundWords: state.foundWords,
});

const WordListContainer = connect(mapStateToProps)(WordList);

export default WordListContainer;

