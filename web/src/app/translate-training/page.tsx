"use client";

import React, { useCallback, useEffect, useState } from "react";
import { formatWordList, Word } from "@/app/lib/wordRecord";
import { Score } from "@/app/components/Score";
import { WordService } from "@/api";
import { Label } from "@/app/components/Label";
import { InputText } from "@/app/components/InputText";
import { BasicButton } from "@/app/components/BasicButton";

export default function TranslateTrainingPage() {
  const [shuffledTranslateData, setShuffledTranslateData] = useState<
    [string, string][]
  >([]);
  const [translateIndex, setTranslateIndex] = useState<number>(0);
  const [text, setText] = useState<string>("");
  const [wordList, setWordList] = useState<Word[]>([]);
  const [score, setScore] = useState<number[]>([0]);
  const [trainingLength, setTrainingLength] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await WordService.list();
      setWordList(response);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const getTrainingData = () => {
      if (wordList.length === 0) {
        return <div>Loading...</div>;
      }
      setShuffledTranslateData(shuffleArray(formatWordList(wordList)));
      setTranslateIndex(0);
      setTrainingLength(trainingLength + 1);
    };
    getTrainingData();
  }, [wordList]);

  const shuffleArray = (array: [string, string][]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  function getSyllabaryValue(li: [string, string], isDisplay: boolean) {
    return Object.values(li)[isDisplay ? 0 : 1];
  }

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    translateData: [string, string],
  ) => {
    setText(event.target.value);
    if (translateData) {
      setScore((prevScores) => {
        const updatedScores = [...prevScores];
        updatedScores[updatedScores.length - 1] =
          event.target.value === translateData[0] ? 1 : 0;
        return updatedScores;
      });
    }
  };

  const loadData = useCallback(() => {
    const goAhead = translateIndex + 1 < shuffledTranslateData.length;
    setTrainingLength(trainingLength + 1);
    setScore((prevScore) => {
      return [...prevScore, 0];
    });
    setTranslateIndex(goAhead ? translateIndex + 1 : 0);
    setText("");
  }, [shuffledTranslateData.length, translateIndex]);

  if (!shuffledTranslateData || shuffledTranslateData.length == 0) {
    return <div>Loading...</div>;
  }

  const key = shuffledTranslateData[translateIndex][0];
  const match = text === shuffledTranslateData[translateIndex][0];
  const displayValue = getSyllabaryValue(
    shuffledTranslateData[translateIndex],
    true,
  );
  const title = getSyllabaryValue(shuffledTranslateData[translateIndex], false);

  return (
    <div className="lg:flex size-full">
      <div className="lg:w-3/12 size-full flex justify-end">
        <div className="lg:hidden flex">
          <Score score={score} trainingLength={trainingLength} />
        </div>
      </div>
      <div className="lg:w-6/12 size-full">
        <div className="flex gap-4">
          <ul className="flex flex-col gap-4 justify-center size-full">
            <li className="flex items-center gap-5" key={key}>
              <Label match={match} label={displayValue} title={title} />
              <InputText
                value={text}
                onChangeHandler={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(
                    event,
                    shuffledTranslateData[translateIndex],
                  )
                }
              />
            </li>
            <li className="flex items-center gap-5 size-full">
              <div className="w-full"></div>
              <BasicButton label="Other Try" onClickHandler={loadData} />
            </li>
          </ul>
        </div>
      </div>
      <div className="lg:w-3/12 flex justify-end">
        <div className="lg:flex hidden">
          <Score score={score} trainingLength={trainingLength} />
        </div>
      </div>
    </div>
  );
}
