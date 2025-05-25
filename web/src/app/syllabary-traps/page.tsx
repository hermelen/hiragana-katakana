"use client";

import {
  getSyllableListToRecord,
  SyllabaryRecord,
} from "@/app/lib/syllabaryRecord";
import React, { useCallback, useEffect, useState } from "react";
import {
  HiraganaTraps,
  KatakanaTraps,
  SyllabaryTrapList,
} from "@/app/lib/syllabaryTrapsList";
import { Radio } from "@/app/components/Radio";
import { computeScore } from "@/app/lib/score";
import { Score } from "@/app/components/Score";
import { SyllableService } from "@/api";
import { Syllable } from "@/api/syllable";
import { Label } from "@/app/components/Label";
import { InputText } from "@/app/components/InputText";
import { BasicButton } from "@/app/components/BasicButton";
import { getSyllabaryValue } from "@/app/lib/utils";

export default function TrapsPage() {
  const [trapData, setTrapData] = useState<SyllabaryRecord>({});
  const [local, setLocal] = useState<boolean>(true);
  const [textList, setTextList] = useState<string[]>([]);
  const [syllableList, setSyllableList] = useState<Syllable[]>([]);
  const [syllabaryRecord, setSyllabaryRecord] = useState<SyllabaryRecord>({});
  const [score, setScore] = useState<number[]>([0]);
  const [trainingLength, setTrainingLength] = useState<number>(0);

  const loadTraining = useCallback(
    (trainingLength: number) => {
      if (syllableList.length > 0) {
        const trapList: SyllabaryTrapList = local
          ? HiraganaTraps
          : KatakanaTraps;
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
      }
    },
    [local, syllabaryRecord],
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
      const response = await SyllableService.list();
      setSyllableList(response);
    };
    fetchData();
  }, []);

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
    <div className="lg:flex size-full">
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
              const match = textList[index] === key;
              const displayValue = getSyllabaryValue(li, local, true);
              const title = getSyllabaryValue(li, local, false);
              return (
                <li className="flex items-center gap-5" key={key}>
                  <Label
                    match={match}
                    label={displayValue}
                    title={title}
                    width={20}
                  ></Label>
                  <InputText
                    value={textList[index]}
                    onChangeHandler={(event) => handleInputChange(event, index)}
                  />
                </li>
              );
            })}
            <li className="flex items-center gap-5">
              <div className="w-20 h-10"></div>
              <BasicButton
                label="Next"
                onClickHandler={() => reLoadTraining(trainingLength)}
              />
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
