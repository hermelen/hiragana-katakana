"use client";

import React, { useCallback, useEffect, useState } from "react";
import { formatWordList, Word } from "@/app/lib/wordRecord";
import { getWordList } from "@/api/http";
import { Score } from "@/app/components/Score";
import { computeScore } from "@/app/lib/score";

export default function TranslateTrainingPage() {
  const [shuffledTranslateData, setShuffledTranslateData] = useState<
    [string, string][]
  >([]);
  const [translateIndex, setTranslateIndex] = useState<number>(0);
  const [text, setText] = useState<string>("");
  const [wordList, setWordList] = useState<Word[]>([]);
  const [score, setScore] = useState<number[]>([0]);
  const [trainingLength, setTrainingLength] = useState<number>(0);
  const backendName = "rust";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchData = async () => {
      const response = await getWordList(apiUrl, backendName);
      setWordList(response);
    };
    fetchData();
  }, [backendName, apiUrl]);

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
        console.log(updatedScores);
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

  return (
    <div className="size-full lg:flex">
      <div className="lg:w-4/12 size-full flex justify-end">
        <div className="lg:hidden flex">
          <Score score={score} trainingLength={trainingLength} />
        </div>
      </div>
      <div className="lg:w-6/12 size-full">
        <div className="flex gap-4">
          <ul className="flex flex-col gap-4 justify-center size-full">
            <li className="flex items-center gap-5 size-full">
              <div
                className={`text-4xl 
                          text-center
                          flex
                          items-center
                          justify-center
                          w-80 
                          h-10 
                          rounded-lg 
                          bg-gradient-to-b 
                          shadow-lg
                          ${text !== shuffledTranslateData[translateIndex][0] ? "from-rose-500" : "from-indigo-500"}`}
                title={shuffledTranslateData[translateIndex][0]}
              >
                {shuffledTranslateData[translateIndex][1]}
              </div>
              <input
                className="h-10 flex-1 text-center rounded-lg shadow-lg text-black text-xl size-full"
                type="text"
                value={text}
                onChange={(event) =>
                  handleInputChange(
                    event,
                    shuffledTranslateData[translateIndex],
                  )
                }
                placeholder="Type something..."
              />
            </li>
            <li className="flex items-center gap-5 size-full">
              <div className="w-80 h-10"></div>
              <button
                className={`h-10      
                          size-full
                          flex-1 
                          text-xl 
                          text-center
                          flex
                          items-center
                          justify-center
                          rounded-lg 
                          bg-gradient-to-b 
                          shadow-lg                                        
                          from-indigo-500`}
                onClick={loadData}
              >
                Other Try
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="lg:w-4/12 flex justify-end">
        <div className="lg:flex hidden">
          <Score score={score} trainingLength={trainingLength} />
        </div>
      </div>
    </div>
  );
}
