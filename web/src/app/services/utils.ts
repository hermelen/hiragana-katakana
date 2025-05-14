export function getSyllabaryValue(
  li: [string, [string, string]],
  isLocal: boolean,
  isDisplay: boolean,
) {
  const hiragana = 0;
  const katakana = 1;
  const syllabaryArray = Object.values(li)[1];
  if (isLocal) {
    if (isDisplay) {
      return syllabaryArray[hiragana];
    } else {
      return syllabaryArray[katakana];
    }
  } else {
    if (isDisplay) {
      return syllabaryArray[katakana];
    } else {
      return syllabaryArray[hiragana];
    }
  }
}