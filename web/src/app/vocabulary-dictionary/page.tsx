"use client";

import {
  getSyllableListToRecord,
  SyllabaryRecord,
} from "@/app/lib/syllabaryRecord";
import React, { useEffect, useState } from "react";
import { SyllabaryTrapList } from "@/app/lib/syllabaryTrapsList";
import { Radio } from "@/app/components/Radio";
import { Syllable } from "@/app/syllabary-table/page";
import { getSyllableList, getWordList } from "@/api/http";
import { formatWordList, Word } from "@/app/lib/wordRecord";

export default function VocabularyDictionaryPage() {
  const [translateData, setTranslateData] = useState<[string, string][]>([]);
  const [wordList, setWordList] = useState<Word[]>([]);
  const backendName = "rust";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchWordData = async () => {
      const response = await getWordList(apiUrl, backendName);
      setWordList(response);
    };
    fetchWordData();
  }, [backendName, apiUrl]);

  useEffect(() => {
    setTranslateData(formatWordList(wordList));
  }, [wordList]);

  function shuffleArray(array: Word[]): [string, string] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return formatWordList(array)[0];
  }

  if (!translateData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="lg:w-6/12 size-full">
      <div className="flex gap-4">
        <ul className="flex flex-col gap-4 justify-center size-full">
          {translateData.map((val) => {
            const key = val[0];
            const value = val[1];
            return (
              <li className="flex items-center gap-5 size-full" key={key}>
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
                                    from-fuchsia-500`}
                >
                  {key}
                </div>
                <div className="h-10 flex-1 rounded-lg shadow-lg text-black text-xl bg-white flex items-center justify-center">
                  {value}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
