"use client";
import React, { useCallback, useEffect, useState } from "react";
import { formatTypedWordList, Word } from "@/app/lib/wordRecord";
import { Checkboxes } from "@/app/components/Checkboxes";
import { WordService } from "@/api";
import { InputText } from "@/app/components/InputText";
import { BasicButton } from "@/app/components/BasicButton";
import { DisplayValue } from "@/app/components/DisplayValue";
import { Label } from "@/app/components/Label";

export default function DictionaryPage() {
  const [translateData, setTranslateData] = useState<[string, string][]>([]);
  const [wordList, setWordList] = useState<Word[]>([]);
  const [checkedList, setCheckedList] = useState<boolean[]>([true, true, true]);
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);

  const [newWord, setNewWord] = useState<Word>({
    roman: "",
    hiragana: "",
    katakana: "",
    kanji: "",
  });

  const [edit, setEdit] = useState<boolean>(false);
  const toggleEdit = useCallback(() => {
    setEdit(!edit);
  }, [edit]);

  useEffect(() => {
    const fetchWordData = async () => {
      const response = await WordService.list();
      setWordList(response);
    };
    fetchWordData();
  }, []);

  let submit: () => Promise<void>;
  submit = useCallback(async () => {
    const response = await WordService.create(newWord);
    setWordList((prevWordList) => [...prevWordList, response]);
    setEdit(false);
    setNewWord({
      roman: "",
      hiragana: "",
      katakana: "",
      kanji: "",
    });
  }, [newWord]);

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
      <div className={`pt-4 pb-4 flex ${edit && "hidden"}`}>
        <Checkboxes
          checkedList={checkedList}
          onChange={(checkedList) => setCheckedList(checkedList)}
        />
      </div>
      <div className={`flex gap-4 ${edit && "hidden"}`}>
        <ul className="flex flex-col gap-4 justify-center size-full">
          {translateData.map((val) => {
            const key = val[0];
            const value = val[1];
            return (
              <li
                className="flex items-center gap-5 size-full toggle-visible-children-on-hover"
                key={key}
              >
                <BasicButton
                  label="Edit"
                  fromGradient="from-stone-700"
                  fromHoverGradient="hover:from-stone-600"
                  onClickHandler={() => console.log("To be implemented")}
                />
                <Label label={key} width={80} />
                <DisplayValue label={value} />
              </li>
            );
          })}
          <li>
            <BasicButton
              label="Add word"
              width={80}
              fromGradient="from-stone-700"
              fromHoverGradient="hover:from-stone-600"
              onClickHandler={toggleEdit}
            />
          </li>
        </ul>
      </div>
      <div className={`flex gap-4 ${!edit && "hidden"}`}>
        <ul className="flex flex-col gap-4 justify-center size-full">
          <li className="flex items-center gap-5 size-full">
            <div className="w-80"></div>
            <InputText
              value={newWord.kanji}
              classValue="size-full"
              placeholder="Kanji..."
              onChangeHandler={(e) =>
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
            <InputText
              value={newWord.katakana}
              classValue="size-full"
              placeholder="Katakana..."
              onChangeHandler={(e) =>
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
            <InputText
              value={newWord.roman}
              classValue="size-full"
              placeholder="English..."
              onChangeHandler={(e) =>
                setNewWord({ ...newWord, roman: e.target.value })
              }
            />
            <InputText
              value={newWord.hiragana}
              classValue="size-full"
              placeholder="Hiragana..."
              onChangeHandler={(e) =>
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
            <BasicButton
              label="Cancel"
              fromGradient="from-stone-700"
              fromHoverGradient="hover:from-stone-600"
              onClickHandler={toggleEdit}
            />
            <BasicButton
              label="Save word"
              fromGradient={
                submitDisabled
                  ? "from-rose-500 disabled:opacity-75"
                  : "from-indigo-500"
              }
              fromHoverGradient={
                submitDisabled ? undefined : "hover:from-indigo-400"
              }
              disabled={submitDisabled}
              onClickHandler={submit}
            />
          </li>
        </ul>
      </div>
    </div>
  );
}
