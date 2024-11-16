"use client"

import {getSyllableListToRecord, SyllabaryRecord} from "@/app/lib/syllabaryRecord";
import React, {useCallback, useEffect, useState} from "react";
import {Radio} from "@/app/components/Radio";
import {Syllable} from "@/app/syllabary-table/page";
import {getSyllableList} from "@/api/http";

export default function SyllabaryTrainingPage() {
  const [trainingData, setTrainingData] = useState<SyllabaryRecord>({});
  const [local, setLocal] = useState<boolean>(true);
  const [basic, setBasic] = useState<boolean>(true);
  const [textList, setTextList] = useState<string[]>([]);
  const [score, setScore] = useState<number[]>([0]);
  const [syllableList, setSyllableList] = useState<Syllable[]>([]);
  const backendName = "rust";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchData = async () => {
      const response = await getSyllableList(apiUrl, backendName);
      setSyllableList(response);
    };
    fetchData();
  }, [backendName, apiUrl]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newTextList = [...textList];
    newTextList[index] = event.target.value;
    setTextList(newTextList);
    computeScore(newTextList);
  }, [textList]);


  function computeScore(sourceList: string[]) {
    const targetList = Object.entries(trainingData).map((val => val[0]));
    let tryScore = 0
    for (let i = 0; i < targetList.length; i++) {
      if (sourceList[i] === targetList[i]) {
        tryScore++
      }
    }
    let updatedScore = score;
    updatedScore[score.length - 1] = tryScore;
    setScore(updatedScore);
  }

  function shuffleArray(array: [string, [string, string]][]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  useEffect(() => {
    const getTrainingData = () => {
      if (syllableList.length === 0) {
        return <div>Loading...</div>;
      }
      const trainingList: [string, [string, string]][] = Object.entries(getSyllableListToRecord(syllableList));
      const trainingCharacters = shuffleArray(trainingList);
      let trainingData: SyllabaryRecord = {};
      const initialTextListState: string[] = [];
      for (let i = 0; i < trainingCharacters.length; i++) {
        if (initialTextListState.length < 10) {
          const basicData = basic && trainingCharacters[i][1][0].length === 1;
          const advancedData = !basic && trainingCharacters[i][1][0].length === 2;
          if (basicData) {
            initialTextListState.push("");
            trainingData[trainingCharacters[i][0]] = trainingCharacters[i][1];
          }
          if (advancedData) {
            initialTextListState.push("");
            trainingData[trainingCharacters[i][0]] = trainingCharacters[i][1];
          }
        }
      }
      setTextList(initialTextListState);
      setTrainingData(trainingData);
    };
    getTrainingData();
  }, [syllableList, basic, score.length]);


  const handleReload = useCallback(() => {
    setScore((prevScore) => {
      return [...prevScore, 0];
    });
  }, []);

  const handleLocalChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setLocal(event.target.value === 'true');
  }, [local]);


  const handleBasicChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setBasic(event.target.value === 'true');
  }, [basic]);

  return (
    <div className={"md:w-4/12 size-full"}>
      {score.reduce((acc, curr) => acc + curr, 0)}/{(score.length * 10)}
      <div className="pt-4 pb-4 flex gap-10">
        <Radio className={"flex-1"}
               position="right"
               label="hiragana"
               name="hiragana"
               value="true"
               checked={local}
               onChange={handleLocalChange}/>
        <Radio className={"flex-1"}
               position="left"
               label="katakana"
               name="katakana"
               value="false"
               checked={!local}
               onChange={handleLocalChange}/>
      </div>
      <div className="pt-4 pb-4 flex gap-10">
        <Radio className={"flex-1"}
               position="right"
               label="basic"
               name="basic"
               value="true"
               checked={basic}
               onChange={handleBasicChange}/>
        <Radio className={"flex-1"}
               position="left"
               label="advanced"
               name="advanced"
               value="false"
               checked={!basic}
               onChange={handleBasicChange}/>
      </div>
      <div className={"flex gap-4"}>
        <ul className="flex flex-col gap-4 justify-center size-full">
          {Object.entries(trainingData).map((li, index) => {
            const key = li[0];
            const value = local ? Object.values(li)[1][0] : Object.values(li)[1][1];
            const match = textList[index] === key;
            return (
              <li className={`flex items-center gap-5`} title={key} key={key}>
                <div>
                  <div className={
                    `text-4xl 
                                        text-center
                                        flex
                                        items-center
                                        justify-center
                                        w-20 
                                        h-10 
                                        rounded-lg 
                                        bg-gradient-to-b 
                                        shadow-lg
                                        ${!match && "from-red-500"}
                                        ${match && "from-fuchsia-500"}`}>
                    {value}
                  </div>
                </div>
                <input
                  className={`h-10 flex-1 text-center rounded-lg shadow-lg text-black text-xl`}
                  type="text"
                  value={textList[index]}
                  onChange={(event) => handleInputChange(event, index)}
                  placeholder="Type something..."/>
              </li>
            )
          })}
          <li className={`flex items-center gap-5`}>
            <div className={`w-20 h-10`}></div>
            <button className={`h-10
                            flex-1
                            text-center
                            rounded-lg
                            shadow-lg
                            text-white
                            text-xl
                            bg-gradient-to-b
                            from-fuchsia-500`}
                    onClick={handleReload}>
              Other Try
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}