"use client";
import React, { useCallback, useEffect, useState } from "react";
import { getWordList } from "@/api/http";
import { formatWordList, Word } from "@/app/lib/wordRecord";

export default function VocabularyDictionaryPage() {
  const [translateData, setTranslateData] = useState<[string, string][]>([]);
  const [wordList, setWordList] = useState<Word[]>([]);
  const backendName = "rust";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const [edit, setEdit] = useState<boolean>(false);
  const toggleEdit = useCallback(() => {
    setEdit(!edit);
  }, [edit]);

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

  if (!translateData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="lg:w-6/12 size-full">
      <div className={`flex gap-4 ${edit && "hidden"}`}>
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
                                    from-indigo-500`}
                >
                  {key}
                </div>
                <div className="h-10 flex-1 rounded-lg shadow-lg text-black text-2xl bg-white flex items-center justify-center">
                  {value}
                </div>
              </li>
            );
          })}
          <button
            className={`w-80 
                          h-10
                          text-xl 
                          text-center
                          flex
                          items-center
                          justify-center
                          rounded-lg 
                          bg-gradient-to-b 
                          shadow-lg                                        
                          from-stone-700 hover:from-stone-600`}
            onClick={toggleEdit}
          >
            Add word
          </button>
        </ul>
      </div>
      <div className={`flex gap-4 ${!edit && "hidden"}`}>
        <ul className="flex flex-col gap-4 justify-center size-full">
          <li className="flex items-center gap-5 size-full">
            <input
              className={`text-xl 
                          text-center
                          flex
                          items-center
                          justify-center
                          w-80 
                          h-10 
                          rounded-lg 
                          shadow-lg`}
              placeholder="Japanese version..."
            />
            <input
              className="h-10 flex-1 text-center rounded-lg shadow-lg text-black text-xl size-full"
              type="text"
              placeholder="English version..."
            />
          </li>
          <li className="flex items-center gap-5 size-full">
            <button
              className={`h-10                           
                          w-80
                          text-xl 
                          text-center
                          flex
                          items-center
                          justify-center
                          rounded-lg 
                          bg-gradient-to-b 
                          shadow-lg                                        
                          from-stone-700 hover:from-stone-600`}
              onClick={toggleEdit}
            >
              Cancel
            </button>
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
                          from-indigo-500`}
            >
              Save word
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
