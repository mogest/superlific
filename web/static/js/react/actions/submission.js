export function selectionSent() {
  return {type: 'SELECTION_SENT'};
}

export function uniqueSubmission(word, result) {
  return {
    type: 'UNIQUE_SUBMISSION',
    word,
    points: result.points,
  };
}

export function duplicateSubmission(word) {
  return {
    type: 'DUPLICATE_SUBMISSION',
    word,
  };
}

export function existingSubmission(word) {
  return {
    type: 'EXISTING_SUBMISSION',
    word,
  };
}

export function invalidSubmission(word) {
  return {
    type: 'INVALID_SUBMISSION',
    word,
  };
}
