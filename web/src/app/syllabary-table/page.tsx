"use client";

import React, { useEffect, useState } from "react";
import { Radio } from "@/app/components/Radio";
import { Syllable } from "@/api/syllable";
import { SyllableService } from "@/api";
import { cn } from "@/app/services/utils";

export default function SyllabaryTablePage() {
  type TableData = Record<string, [string, string]>[];
  type BooleanDictionary = {
    [key: string]: boolean;
  };
  const [local, setLocal] = useState<boolean>(true);
  const [faceDictionary, setFaceDictionary] = useState<BooleanDictionary>({});
  const [syllableList, setSyllableList] = useState<Syllable[]>([]);
  const [syllabaryRecordList, setSyllabaryRecordList] = useState<TableData[]>(
    [],
  );
  const noChar = "";

  useEffect(() => {
    const fetchData = async () => {
      const response = await SyllableService.list();
      setSyllableList(response);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const formatSyllabaryRecordList = () => {
      const tableData: TableData[] = [];
      let currentArray: TableData = [];
      if (syllableList.length === 0) {
        return;
      }
      for (const syllable of syllableList) {
        const currentItem: Record<string, [string, string]> = {
          [syllable.roman]: [syllable.hiragana, syllable.katakana],
        };
        if (syllable.roman.length === 1) {
          if (currentArray.length > 0) {
            tableData.push(currentArray);
            currentArray = [];
          }
          currentArray.push(currentItem);
        } else {
          currentArray.push(currentItem);
          if (syllable.roman === "mi") {
            currentArray.push({ yi: [noChar, noChar] });
          }
          if (syllable.roman === "me") {
            currentArray.push({ ye: [noChar, noChar] });
          }
          if (syllable.roman === "ru") {
            currentArray.push({ wu: [noChar, noChar] });
          }
        }
      }

      if (currentArray.length > 0) {
        tableData.push(currentArray);
      }
      setSyllabaryRecordList(tableData);
    };
    formatSyllabaryRecordList();
    initFaceDictionary(!local);
  }, [syllableList]);

  const initFaceDictionary = (isLocal: boolean) => {
    if (syllableList.length === 0) {
      return;
    }
    const baseFaceDict: BooleanDictionary = {};
    for (const syllable of syllableList) {
      baseFaceDict[syllable.roman] = isLocal;
    }
    setFaceDictionary(baseFaceDict);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocal(event.target.value === "true");
    initFaceDictionary(local);
  };

  return (
    <div>
      <div className="pt-4 pb-4 flex">
        <Radio
          className="flex-1"
          position="right"
          label="hiragana"
          name="syllabary"
          value="true"
          checked={local}
          onChange={handleChange}
        />
        <Radio
          className="flex-1"
          position="left"
          label="katakana"
          name="syllabary"
          value="false"
          checked={!local}
          onChange={handleChange}
        />
      </div>
      <div className="flex gap-4">
        {syllabaryRecordList.map((ul, ulIndex) => (
          <ul key={ulIndex} className="flex flex-col gap-4">
            {ul.map((li, liIndex) => {
              const key = Object.keys(li)[0];
              const value = Object.values(li)[0];
              const isChar = value[0] !== "" && value[1] !== "";
              return (
                <li key={liIndex}>
                  <div
                    key={key}
                    onClick={() => {
                      const prevDictionary = { ...faceDictionary };
                      initFaceDictionary(!local);
                      setFaceDictionary((initDictionary) => {
                        const newDictionary = { ...initDictionary };
                        newDictionary[key] =
                          local === prevDictionary[key]
                            ? !local
                            : !newDictionary[key];
                        return newDictionary;
                      });
                    }}
                    className="relative w-20 h-20 cursor-pointer"
                  >
                    <div
                      className={cn(
                        "w-20 h-20",
                        isChar &&
                          "flex flex-col items-center justify-center rounded-lg absolute transition-all duration-1500 transform-style-preserve-3d bg-linear-to-b to-stone-800 shadow-lg backface-hidden from-indigo-500",
                        faceDictionary[key] ? "rotate-y-180" : "rotate-y-0",
                      )}
                    >
                      <div className="text-4xl text-center">{value[0]}</div>
                      <div className="text-l text-center">{isChar && key}</div>
                    </div>
                    <div
                      className={cn(
                        "w-20 h-20",
                        isChar &&
                          "flex flex-col items-center justify-center rounded-lg absolute transition-all duration-1500 transform-style-preserve-3d bg-linear-to-b to-stone-800 shadow-lg backface-hidden from-rose-500",
                        faceDictionary[key] ? "rotate-y-0" : "rotate-y-180",
                      )}
                    >
                      <div className="text-4xl text-center">{value[1]}</div>
                      <div className="text-l text-center">{isChar && key}</div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </div>
  );
}
