"use client";

import React, { useEffect, useState } from "react";
import { Radio } from "@/app/components/Radio";
import { getJapanese, getPhonetic, getRoman } from "@/app/services/theme";
import {
  getSyllableListToRecord,
  SyllabaryRecord,
} from "@/app/lib/syllabaryRecord";
import { SyllableService } from "@/api";
import { Syllable } from "@/api/syllable";
import { InputText } from "@/app/components/InputText";
import { DisplayValue } from "@/app/components/DisplayValue";

export default function RomanToJapanesePage() {
  const [text, setText] = useState<string>("");
  const [roman, setRoman] = useState<string>("");
  const [hiragana, setHiragana] = useState<string>("");
  const [katakana, setKatakana] = useState<string>("");
  const [local, setLocal] = useState<boolean>(true);
  const [syllableList, setSyllableList] = useState<Syllable[]>([]);
  const [syllabaryRecord, setSyllabaryRecord] = useState<SyllabaryRecord>({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await SyllableService.list();
      setSyllableList(response);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const syllableListToRecord = () => {
      setSyllabaryRecord(getSyllableListToRecord(syllableList));
    };
    syllableListToRecord();
  }, [syllableList]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    const textToTranslate = getPhonetic(event.target.value);
    let matchText: [string[], string[]] = [[], []];
    const [translation, _] = getJapanese(
      syllabaryRecord,
      matchText,
      textToTranslate,
      3,
      true,
    );
    setHiragana(translation[0].join(""));
    setKatakana(translation[1].join(""));
    const resultToRoman = getRoman(syllabaryRecord, translation[0]);
    setRoman(resultToRoman);
  };

  const handleLocalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocal(event.target.value === "true");
  };

  return (
    <div className="lg:w-6/12 size-full">
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
          <li className="flex items-center gap-5 size-full">
            <div className="w-80 h-10"></div>
            <InputText value={text} onChangeHandler={handleInputChange} />
          </li>
          <li className="flex items-center gap-5 size-full">
            <div
              className={`text-xl 
                            text-center
                            flex
                            items-center
                            justify-center
                            w-80 
                            h-10 
                            rounded-lg 
                            bg-gradient-to-b 
                            shadow-lg 
                            from-indigo-500 
                            to-stone-800`}
            >
              {roman}
            </div>
            <DisplayValue label={local ? hiragana : katakana} />
          </li>
        </ul>
      </div>
    </div>
  );
}
