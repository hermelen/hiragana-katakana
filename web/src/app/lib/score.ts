import { SyllabaryRecord } from "@/app/lib/syllabaryRecord";

export function computeScore(
  sourceList: string[],
  score: number[],
  trainingData: SyllabaryRecord,
): number[] {
  const targetList = Object.entries(trainingData).map((val) => val[0]);
  let tryScore = 0;
  for (let i = 0; i < targetList.length; i++) {
    if (sourceList[i] === targetList[i]) {
      tryScore++;
    }
  }
  let updatedScore = score;
  updatedScore[score.length - 1] = tryScore;
  return updatedScore;
}
