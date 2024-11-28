"use client";

import {
  getSyllableListToRecord,
  SyllabaryRecord,
} from "@/app/lib/syllabaryRecord";
import React, { useCallback, useEffect, useState } from "react";
import { Radio } from "@/app/components/Radio";
import { Syllable } from "@/app/syllabary-table/page";
import { getSyllableList } from "@/api/http";
import { computeScore } from "@/app/lib/score";

export default function SyllabaryTrainingPage() {
  const [syllabaryRecord, setSyllabaryRecord] = useState<SyllabaryRecord>({});
  const [local, setLocal] = useState<boolean>(true);
  const [basic, setBasic] = useState<boolean>(true);
  const [textList, setTextList] = useState<string[]>([]);
  const [score, setScore] = useState<number[]>([0]);
  const [trainingLength, setTrainingLength] = useState<number>(0);
  const [syllableList, setSyllableList] = useState<Syllable[]>([]);
  const backendName = "rust";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const newTextList = [...textList];
      newTextList[index] = event.target.value;
      setTextList(newTextList);
      setScore(computeScore(newTextList, score, syllabaryRecord));
    },
    [score, textList, syllabaryRecord],
  );

  const shuffleArray = (array: [string, [string, string]][]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const loadTraining = useCallback(
    (trainingLength) => {
      const trainingList: [string, [string, string]][] = Object.entries(
        getSyllableListToRecord(syllableList),
      );
      const trainingCharacters = shuffleArray(trainingList);
      let record: SyllabaryRecord = {};
      const initialTextListState: string[] = [];
      for (let i = 0; i < trainingCharacters.length; i++) {
        if (initialTextListState.length < 10) {
          if (basic && trainingCharacters[i][1][0].length === 1) {
            record[trainingCharacters[i][0]] = trainingCharacters[i][1];
          } else if (trainingCharacters[i][1][0].length === 2) {
            record[trainingCharacters[i][0]] = trainingCharacters[i][1];
          }
          initialTextListState.push("");
        }
      }
      setTextList(initialTextListState);
      setSyllabaryRecord(record);
      setTrainingLength(trainingLength + 10);
    },
    [basic, syllableList],
  );

  const reLoadTraining = useCallback(
    (trainingLength) => {
      loadTraining(trainingLength);
      setScore((prevScore) => {
        return [...prevScore, 0];
      });
    },
    [syllabaryRecord],
  );

  const handleLocalChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLocal(event.target.value === "true");
    },
    [],
  );

  const handleBasicChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setBasic(event.target.value === "true");
    },
    [],
  );

  useEffect(() => {
    const fetchData = async () => {
      const response = await getSyllableList(apiUrl, backendName);
      setSyllableList(response);
    };
    fetchData();
  }, [backendName, apiUrl]);

  useEffect(() => {
    if (syllableList) {
      loadTraining(0);
    }
  }, [loadTraining, syllableList]);

  if (Object.entries(syllabaryRecord).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="size-full lg:flex">
      <div className="lg:w-4/12 size-full flex justify-end">
        <div
          className="lg:hidden inline-flex 
          justify-center
          items-center
          pr-5
          pl-5
          mb-5
          h-10
          text-center
          rounded-sm
          shadow-lg
          text-white
          text-xl
          bg-gradient-to-b
          from-indigo-500"
        >
          {score.reduce((acc, curr) => acc + curr, 0)}/{trainingLength}
        </div>
      </div>
      <div className="lg:w-4/12 size-full">
        <div className="pt-4 pb-4 flex">
          <Radio
            className="flex-1"
            position="right"
            label="hiragana"
            name="hiragana"
            value="true"
            checked={local}
            onChange={handleLocalChange}
          />
          <Radio
            className="flex-1"
            position="left"
            label="katakana"
            name="katakana"
            value="false"
            checked={!local}
            onChange={handleLocalChange}
          />
        </div>
        <div className="pt-4 pb-4 flex">
          <Radio
            className="flex-1"
            position="right"
            label="basic"
            name="basic"
            value="true"
            checked={basic}
            onChange={handleBasicChange}
          />
          <Radio
            className="flex-1"
            position="left"
            label="advanced"
            name="advanced"
            value="false"
            checked={!basic}
            onChange={handleBasicChange}
          />
        </div>
        <div className="flex gap-4">
          <ul className="flex flex-col gap-4 justify-center size-full">
            {Object.entries(syllabaryRecord).map((li, index) => {
              const key = li[0];
              const value = local
                ? Object.values(li)[1][0]
                : Object.values(li)[1][1];
              const match = textList[index] === key;
              return (
                <li className="flex items-center gap-5" title={key} key={key}>
                  <div>
                    <div
                      className={`text-4xl 
                                        text-center
                                        flex
                                        items-center
                                        justify-center
                                        w-20 
                                        h-10 
                                        rounded-lg 
                                        bg-gradient-to-b 
                                        shadow-lg
                                        ${!match && "from-rose-500"}
                                        ${match && "from-indigo-500"}`}
                    >
                      {value}
                    </div>
                  </div>
                  <input
                    className="h-10 flex-1 size-full text-center rounded-lg shadow-lg text-black text-xl"
                    type="text"
                    value={textList[index]}
                    onChange={(event) => handleInputChange(event, index)}
                    placeholder="Type something..."
                  />
                </li>
              );
            })}
            <li className="flex items-center gap-5">
              <div className="w-20 h-10"></div>
              <button
                className={`h-10
                            flex-1
                            text-center
                            rounded-lg
                            shadow-lg
                            text-white
                            text-xl
                            bg-gradient-to-b
                            from-indigo-500`}
                onClick={() => reLoadTraining(trainingLength)}
              >
                Other Try
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="lg:w-4/12 flex justify-end">
        <div
          className="lg:flex hidden 
                     items-center
                     pr-5
                     pl-5
                     h-10
                     text-center
                     rounded-sm
                     shadow-lg
                     text-white
                     text-xl
                     bg-gradient-to-b
                     from-indigo-500"
        >
          {score.reduce((acc, curr) => acc + curr, 0)}/{trainingLength}
        </div>
      </div>
    </div>
  );
}
