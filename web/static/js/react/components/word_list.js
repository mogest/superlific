import React from 'react';

const renderWord = ([word, state]) => {
  return <li key={word} className={state}>{word}</li>
}

const WordList = ({foundWords}) => {
  return (
    <ul id="word-list">
      {foundWords.map(renderWord)}
    </ul>
  );
};

export default WordList;
