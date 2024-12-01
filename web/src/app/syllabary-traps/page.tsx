"use client";

import {
  getSyllableListToRecord,
  SyllabaryRecord,
} from "@/app/lib/syllabaryRecord";
import React, { useCallback, useEffect, useState } from "react";
import {
  SyllabaryTrapList,
  HiraganaTraps,
  KatakanaTraps,
} from "@/app/lib/syllabaryTrapsList";
import { Radio } from "@/app/components/Radio";
import { getSyllableList } from "@/api/http";
import { Syllable } from "@/app/syllabary-table/page";
import { computeScore } from "@/app/lib/score";
import { Score } from "@/app/components/Score";

export default function SyllabaryTrapsPage() {
  const [trapData, setTrapData] = useState<SyllabaryRecord>({});
  const [local, setLocal] = useState<boolean>(true);
  const [textList, setTextList] = useState<string[]>([]);
  const [syllableList, setSyllableList] = useState<Syllable[]>([]);
  const [syllabaryRecord, setSyllabaryRecord] = useState<SyllabaryRecord>(null);
  const [score, setScore] = useState<number[]>([0]);
  const [trainingLength, setTrainingLength] = useState<number>(0);
  const backendName = "rust";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const loadTraining = useCallback(
    (trainingLength) => {
      const trapList: SyllabaryTrapList = local ? HiraganaTraps : KatakanaTraps;
      const trapCharacters = shuffleArray(
        trapList[Math.floor(Math.random() * trapList.length)],
      );
      let trapData: SyllabaryRecord = {};
      const initialTextListState: string[] = [];
      for (let i = 0; i < trapCharacters.length; i++) {
        initialTextListState.push("");
        trapData[trapCharacters[i]] = syllabaryRecord[trapCharacters[i]];
      }
      setTextList(initialTextListState);
      setTrapData(trapData);
      setTrainingLength(trainingLength + trapCharacters.length);
    },
    [local, syllabaryRecord],
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

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const newTextList = [...textList];
    newTextList[index] = event.target.value;
    setTextList(newTextList);
    setScore(computeScore(newTextList, score, trapData));
  };

  function shuffleArray(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const handleLocalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocal(event.target.value === "true");
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getSyllableList(apiUrl, backendName);
      setSyllableList(response);
    };
    fetchData();
  }, [backendName, apiUrl]);

  useEffect(() => {
    if (syllabaryRecord) {
      loadTraining(trainingLength);
    }
  }, [loadTraining, syllabaryRecord]);

  useEffect(() => {
    const syllableListToRecord = () => {
      if (syllableList.length > 0) {
        setSyllabaryRecord(getSyllableListToRecord(syllableList));
      }
    };
    syllableListToRecord();
  }, [syllableList]);

  if (!trapData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="size-full lg:flex">
      <div className="lg:w-4/12 size-full flex justify-end">
        <div className="lg:hidden flex">
          <Score score={score} trainingLength={trainingLength} />
        </div>
      </div>
      <div className="lg:w-4/12 size-full">
        <div className="pt-4 pb-4 flex">
          <Radio
            className="flex-1"
            position="right"
            label="hiragana"
            name="syllabary"
            value="true"
            checked={local}
            onChange={handleLocalChange}
          />
          <Radio
            className="flex-1"
            position="left"
            label="katakana"
            name="syllabary"
            value="false"
            checked={!local}
            onChange={handleLocalChange}
          />
        </div>
        <div className="flex gap-4">
          <ul className="flex flex-col gap-4 justify-center size-full">
            {Object.entries(trapData).map((li, index) => {
              const key = li[0];
              const value = Object.values(li)[1];
              const match = textList[index] === key;
              return (
                <li key={li[0]} className="flex items-center gap-5">
                  <div
                    key={key}
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
                    title={key}
                  >
                    {local ? value[0] : value[1]}
                  </div>
                  <input
                    className="h-10 flex-1 text-center rounded-lg shadow-lg text-black text-xl"
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
                            text-xl 
                            text-center
                            flex
                            items-center
                            justify-center
                            rounded-lg 
                            bg-gradient-to-b 
                            shadow-lg                                        
                            from-indigo-500`}
                onClick={() => reLoadTraining(trainingLength)}
              >
                Next
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
