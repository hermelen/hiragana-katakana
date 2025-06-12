"use client";

import {
  getSyllableListToRecord,
  SyllabaryRecord,
} from "@/app/lib/syllabaryRecord";
import React, { useCallback, useEffect, useState } from "react";
import { Radio } from "@/app/components/Radio";
import { computeScore } from "@/app/lib/score";
import { Score } from "@/app/components/Score";
import { SyllableService } from "@/api";
import { Syllable } from "@/api/syllable";
import { Label } from "@/app/components/Label";
import { InputText } from "@/app/components/InputText";
import { BasicButton } from "@/app/components/BasicButton";
import { getSyllabaryValue } from "@/app/lib/utils";

export default function SyllabaryTrainingPage() {
  const [syllabaryRecord, setSyllabaryRecord] = useState<SyllabaryRecord>({});
  const [local, setLocal] = useState<boolean>(true);
  const [basic, setBasic] = useState<boolean>(true);
  const [textList, setTextList] = useState<string[]>([]);
  const [score, setScore] = useState<number[]>([0]);
  const [trainingLength, setTrainingLength] = useState<number>(0);
  const [syllableList, setSyllableList] = useState<Syllable[]>([]);

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
    (trainingLength: number) => {
      const trainingList: [string, [string, string]][] = Object.entries(
        getSyllableListToRecord(syllableList),
      );
      const trainingCharacters = shuffleArray(trainingList);
      let record: SyllabaryRecord = {};
      const initialTextListState: string[] = [];
      for (
        let i = 0;
        i < trainingCharacters.length && Object.entries(record).length < 10;
        i++
      ) {
        if (basic) {
          if (trainingCharacters[i][1][0].length === 1) {
            record[trainingCharacters[i][0]] = trainingCharacters[i][1];
            initialTextListState.push("");
          }
        } else {
          if (trainingCharacters[i][1][0].length === 2) {
            record[trainingCharacters[i][0]] = trainingCharacters[i][1];
            initialTextListState.push("");
          }
        }
      }
      setTextList(initialTextListState);
      setSyllabaryRecord(record);
      setTrainingLength(trainingLength + 10);
    },
    [basic, syllableList],
  );

  const reLoadTraining = useCallback(
    (trainingLength: number) => {
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
      const response = await SyllableService.list();
      setSyllableList(response);
    };
    fetchData();
  }, []);

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
      <div className="lg:w-3/12 size-full flex justify-end">
        <div className="lg:hidden flex">
          <Score score={score} trainingLength={trainingLength} />
        </div>
      </div>
      <div className="lg:w-6/12 size-full">
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
              const match = textList[index] === key;
              const displayValue = getSyllabaryValue(li, local, true);
              const title = getSyllabaryValue(li, local, false);
              return (
                <li className="flex items-center gap-5" key={key}>
                  <Label
                    match={match}
                    label={displayValue}
                    title={title}
                    width="80"
                  ></Label>
                  <InputText
                    value={textList[index]}
                    onChangeHandler={(event) => handleInputChange(event, index)}
                  />
                </li>
              );
            })}
            <li className="flex items-center gap-5 size-full">
              <div className="w-80 h-10"></div>
              <BasicButton
                label="Other Try"
                onClickHandler={() => reLoadTraining(trainingLength)}
              />
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
