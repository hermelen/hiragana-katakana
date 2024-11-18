"use client";

import React, { useCallback, useEffect, useState } from "react";
import { formatWordList, Word } from "@/app/lib/wordRecord";
import { getWordList } from "@/api/http";

export default function WordTranslatePage() {
  const [translateData, setTranslateData] = useState<[string, string]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [wordList, setWordList] = useState<Word[]>([]);
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
    setTranslateData(getRandomWordTranslate());
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    if (translateData) {
      setSuccess(event.target.value === translateData[0]);
    }
  };

  function shuffleArray(array: [string, string][]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array[1];
  }

  useEffect(() => {
    const getTrainingData = () => {
      if (wordList.length === 0) {
        return <div>Loading...</div>;
      }
      const trainingList: [string, string][] = formatWordList(wordList);
      const trainingCharacters = shuffleArray(trainingList);
      setTranslateData(trainingCharacters);
    };
    getTrainingData();
  }, [wordList]);

  const getRandomWordTranslate = useCallback((): [string, string] => {
    return shuffleArray(formatWordList(wordList));
  }, []);

  function reloadTranslate() {
    setTranslateData(getRandomWordTranslate());
    setText("");
    setSuccess(false);
  }

  if (!translateData) {
    return <div>Loading...</div>;
  }

  return (
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
                            ${text !== translateData[0] ? "from-red-500" : "from-fuchsia-500"}`}
              title={translateData[0]}
            >
              {translateData[1]}
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
                            ${!success ? "from-red-500 disabled:opacity-75" : "from-fuchsia-500"}`}
              onClick={reloadTranslate}
              disabled={!success}
            >
              Other Try
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
