import React from 'react';

const WordCount = ({wordCount, answerCount}) => {
  if (wordCount === answerCount) {
    return (
      <div id="word-count">
        {answerCount} words
      </div>
    );
  }
  else {
    return (
      <div id="word-count">
        {wordCount} / {answerCount} words
      </div>
    );
  }
};

export default WordCount;
