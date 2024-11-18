"use client";

import React, { useEffect, useState } from "react";
import { getJapanese } from "@/app/services/theme";
import { getSyllableList, getWordList } from "@/api/http";
import { Syllable } from "@/app/syllabary-table/page";
import {
  getSyllableListToRecord,
  SyllabaryRecord,
} from "@/app/lib/syllabaryRecord";
import { formatWordList, Word } from "@/app/lib/wordRecord";

export default function VocabularyThemePage() {
  const [themeData, setThemeData] = useState<[string, string]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [hiragana, setHiragana] = useState<string>("");
  const [katakana, setKatakana] = useState<string>("");
  const [syllableList, setSyllableList] = useState<Syllable[]>([]);
  const [wordList, setWordList] = useState<Word[]>([]);
  const [syllabaryRecord, setSyllabaryRecord] = useState<SyllabaryRecord>({});
  const backendName = "rust";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchData = async () => {
      const response = await getSyllableList(apiUrl, backendName);
      setSyllableList(response);
    };
    fetchData();
  }, [backendName, apiUrl]);

  useEffect(() => {
    const fetchWordData = async () => {
      const response = await getWordList(apiUrl, backendName);
      setWordList(response);
    };
    fetchWordData();
  }, [backendName, apiUrl]);

  useEffect(() => {
    const syllableListToRecord = () => {
      setSyllabaryRecord(getSyllableListToRecord(syllableList));
    };
    syllableListToRecord();
  }, [syllableList]);

  useEffect(() => {
    setThemeData(shuffleArray(formatWordList(wordList)));
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
  };

  function shuffleArray(array: [string, string][]): [string, string] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array[0];
  }

  function reloadTheme() {
    setThemeData(shuffleArray(formatWordList(wordList)));
    setText("");
    setHiragana("");
    setKatakana("");
    setSuccess(false);
  }

  if (!themeData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="lg:w-6/12 size-full">
      <div className="flex gap-4">
        <ul className="flex flex-col gap-4 justify-center size-full">
          <li className="flex items-center gap-5 size-full">
            <div
              title={themeData[1]}
              className={`text-4xl 
                            size-full
                            text-center
                            flex
                            items-center
                            justify-center
                            w-80 
                            h-10 
                            rounded-lg 
                            bg-gradient-to-b 
                            shadow-lg
                            ${hiragana !== themeData[1] && katakana !== themeData[1] ? "from-red-500" : "from-fuchsia-500"}`}
            >
              {themeData[0]}
            </div>
            <input
              className="h-10 flex-1 text-center rounded-lg shadow-lg text-black text-xl size-full"
              type="text"
              value={text}
              onChange={handleInputChange}
              placeholder="Type something..."
            />
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
                            shadow-lg
                            bg-gradient-to-b 
                            ${hiragana === themeData[1] ? "from-fuchsia-500" : "from-red-500"}`}
            >
              hiragana
            </div>
            <div className="h-10 flex-1 rounded-lg shadow-lg text-black text-xl bg-white flex items-center justify-center">
              {hiragana}
            </div>
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
                            shadow-lg
                            bg-gradient-to-b 
                            ${katakana === themeData[1] ? "from-fuchsia-500" : "from-red-500"}`}
            >
              katakana
            </div>
            <div className="h-10 flex-1 rounded-lg shadow-lg text-black text-xl bg-white flex items-center justify-center">
              {katakana}
            </div>
          </li>
          <li className="flex items-center gap-5 size-full">
            <div className="w-80 h-10"></div>
            <button
              className={`h-10 
                            flex-1 
                            text-xl 
                            text-center
                            flex
                            items-center
                            justify-center
                            rounded-lg 
                            shadow-lg                                        
                            bg-gradient-to-b 
                            ${hiragana !== themeData[1] && katakana !== themeData[1] ? "from-red-500 disabled:opacity-75" : "from-fuchsia-500"}`}
              onClick={reloadTheme}
              disabled={hiragana !== themeData[1] && katakana !== themeData[1]}
            >
              Other Try
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
