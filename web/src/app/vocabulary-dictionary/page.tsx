"use client";
import React, { useCallback, useEffect, useState } from "react";
import { getWordList, postWord } from "@/api/http";
import { formatTypedWordList, Word } from "@/app/lib/wordRecord";
import { CharacterType } from "@/app/lib/syllabaryRecord";

export default function VocabularyDictionaryPage() {
  const [translateData, setTranslateData] = useState<[string, string][]>([]);
  const [wordList, setWordList] = useState<Word[]>([]);
  const [checkedList, setCheckedList] = useState<boolean[]>([true, true, true]);
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);
  const backendName = "rust";
  const [newWord, setNewWord] = useState<Word>({
    roman: "",
    hiragana: "",
    katakana: "",
    kanji: "",
  });
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

  let submit: () => Promise<void>;
  submit = useCallback(async () => {
    const response = await postWord(apiUrl, backendName, newWord);
    setWordList((prevWordList) => [...prevWordList, response]);
    setEdit(false);
    setNewWord({
      roman: "",
      hiragana: "",
      katakana: "",
      kanji: "",
    });
  }, [apiUrl, newWord]);

  const updateSubmitDisabled = useCallback(() => {
    setSubmitDisabled(
      !(
        newWord.roman !== "" &&
        (newWord.kanji !== "" ||
          newWord.katakana !== "" ||
          newWord.hiragana !== "")
      ),
    );
  }, [newWord]);

  useEffect(() => {
    updateSubmitDisabled();
  }, [updateSubmitDisabled]);

  const updateTranslateData = useCallback(() => {
    setTranslateData(formatTypedWordList(wordList, checkedList));
  }, [wordList, checkedList]);

  useEffect(() => {
    updateTranslateData();
  }, [updateTranslateData, wordList]);

  if (!translateData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="lg:w-6/12 size-full">
      <div className="pt-4 pb-4 flex">
        {Object.values(CharacterType)
          .filter((x) => typeof x === "string")
          .map((type, index) => (
            <label key={`${type}-${index}`}>
              <input
                type="checkbox"
                checked={checkedList[index]}
                onChange={() =>
                  setCheckedList(
                    checkedList.map((item, idx) =>
                      idx === index ? !item : item,
                    ),
                  )
                }
              />
              {type.toLocaleString()}
            </label>
          ))}
      </div>
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
            <div className="w-80"></div>
            <input
              className="h-10 flex-1 text-center rounded-lg shadow-lg text-black text-xl size-full"
              type="text"
              placeholder="Kanji..."
              value={newWord.kanji}
              onChange={(e) =>
                setNewWord({
                  ...newWord,
                  hiragana: "",
                  katakana: "",
                  kanji: e.target.value,
                })
              }
            />
          </li>
          <li className="flex items-center gap-5 size-full">
            <div className="w-80"></div>
            <input
              className="h-10 flex-1 text-center rounded-lg shadow-lg text-black text-xl size-full"
              type="text"
              placeholder="Katakana..."
              value={newWord.katakana}
              onChange={(e) =>
                setNewWord({
                  ...newWord,
                  hiragana: "",
                  katakana: e.target.value,
                  kanji: "",
                })
              }
            />
          </li>
          <li className="flex items-center gap-5 size-full">
            <input
              className={`text-xl 
                          text-center
                          text-black
                          flex
                          items-center
                          justify-center
                          w-80 
                          h-10 
                          rounded-lg 
                          shadow-lg`}
              placeholder="English..."
              value={newWord.roman}
              onChange={(e) =>
                setNewWord({ ...newWord, roman: e.target.value })
              }
            />
            <input
              className="h-10 flex-1 text-center rounded-lg shadow-lg text-black text-xl size-full"
              type="text"
              placeholder="Hiragana..."
              value={newWord.hiragana}
              onChange={(e) =>
                setNewWord({
                  ...newWord,
                  hiragana: e.target.value,
                  katakana: "",
                  kanji: "",
                })
              }
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
                          ${submitDisabled ? "from-rose-500 disabled:opacity-75" : "from-indigo-500"}`}
              disabled={submitDisabled}
              onClick={submit}
            >
              Save word
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
