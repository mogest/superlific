export default function updateDuplication(data) {
  return {
    type: 'DUPLICATION_REPORTED',
    points: data.points,
    word: data.word,
  }
}
