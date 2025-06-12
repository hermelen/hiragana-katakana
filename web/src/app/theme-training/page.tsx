"use client";

import React, { useCallback, useEffect, useState } from "react";
import { getJapanese } from "@/app/lib/theme";
import {
  getSyllableListToRecord,
  SyllabaryRecord,
} from "@/app/lib/syllabaryRecord";
import { formatWordList, Word } from "@/app/lib/wordRecord";
import { Score } from "@/app/components/Score";
import { SyllableService, WordService } from "@/api";
import { Syllable } from "@/api/syllable";
import { Label } from "@/app/components/Label";
import { InputText } from "@/app/components/InputText";
import { BasicButton } from "@/app/components/BasicButton";
import { DisplayValue } from "@/app/components/DisplayValue";

export default function ThemeTrainingPage() {
  const [themeData, setThemeData] = useState<[string?, string?]>([]);
  const [text, setText] = useState<string>("");
  const [hiragana, setHiragana] = useState<string>("");
  const [katakana, setKatakana] = useState<string>("");
  const [syllableList, setSyllableList] = useState<Syllable[]>([]);
  const [wordList, setWordList] = useState<Word[]>([]);
  const [syllabaryRecord, setSyllabaryRecord] = useState<SyllabaryRecord>({});
  const [score, setScore] = useState<number[]>([0]);
  const [trainingLength, setTrainingLength] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await SyllableService.list();
      setSyllableList(response);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchWordData = async () => {
      const response = await WordService.list();
      setWordList(response);
    };
    fetchWordData();
  }, []);

  useEffect(() => {
    const syllableListToRecord = () => {
      setSyllabaryRecord(getSyllableListToRecord(syllableList));
    };
    syllableListToRecord();
  }, [syllableList]);

  useEffect(() => {
    if (wordList.length > 0) {
      setThemeData(shuffleArray(formatWordList(wordList)));
      setTrainingLength(trainingLength + 1);
    }
  }, [wordList]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    let matchText: [string[], string[]] = [[], []];
    const [translation, _] = getJapanese(
      syllabaryRecord,
      matchText,
      event.target.value,
      3,
      false,
    );
    setHiragana(translation[0].join(""));
    setKatakana(translation[1].join(""));
    if (themeData) {
      setScore((prevScores) => {
        const updatedScores = [...prevScores];
        updatedScores[updatedScores.length - 1] =
          themeData[1] === translation[0].join("") ||
          themeData[1] === translation[1].join("")
            ? 1
            : 0;
        return updatedScores;
      });
    }
  };

  function shuffleArray(array: [string, string][]): [string, string] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array[0];
  }

  function getSyllabaryValue(
    li: [(string | undefined)?, (string | undefined)?],
    isDisplay: boolean,
  ) {
    return Object.values(li)[isDisplay ? 0 : 1];
  }

  const reloadTheme = useCallback(
    (trainingLength: number) => {
      if (wordList.length > 0) {
        setThemeData(shuffleArray(formatWordList(wordList)));
        setText("");
        setHiragana("");
        setKatakana("");
        setTrainingLength(trainingLength + 1);
        setScore((prevScore) => {
          return [...prevScore, 0];
        });
      }
    },
    [wordList],
  );

  if (!themeData) {
    return <div>Loading...</div>;
  }

  const key = themeData[0];
  const match = hiragana === themeData[1] && katakana !== themeData[1];
  const displayValue = getSyllabaryValue(themeData, true);
  const title = getSyllabaryValue(themeData, false);

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
            <li className="flex items-center gap-5 size-full" key={key}>
              <Label match={match} label={displayValue} title={title} />
              <InputText value={text} onChangeHandler={handleInputChange} />
            </li>
            <li className="flex items-center gap-5 size-full">
              <Label label="hiragana" match={hiragana === themeData[1]} />
              <DisplayValue label={katakana} />
            </li>
            <li className="flex items-center gap-5 size-full">
              <Label label="katakana" match={katakana === themeData[1]} />
              <DisplayValue label={katakana} />
            </li>
            <li className="flex items-center gap-5 size-full">
              <div className="w-230 h-10"></div>
              <BasicButton
                label="Next"
                onClickHandler={() => reloadTheme(trainingLength)}
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
